import React, { useRef, useState } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import { material } from 'react-native-typography';
import { NavigationScreenComponent, NavigationScreenProps } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { NavigationStackOptions } from 'react-navigation-stack';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';

interface Props extends NavigationScreenProps {
  // ... other props
}

const PADDING_BOTTOM_FIX = 4;
const DESIRED_DISTANCE = 350;
const FOOTER_SHADOW_DISTANCE = 35;
const FOOTER_HEIGHT = 80;
const HEADER_MAX_HEIGHT = DESIRED_DISTANCE + 56 + PADDING_BOTTOM_FIX + StatusBar.currentHeight - 12; // DO NOT ASK PLS
const HEADER_MIN_HEIGHT = 56 + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const QuestPreview: NavigationScreenComponent<NavigationStackOptions, Props> = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const token = useNavigationParam('token');
  const [isTransitionCompleted, setCompleted] = useState(false);
  const scrollY = new Animated.Value(0);

  const ref = useRef<TransitioningView>();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.9, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 60],
    extrapolate: 'clamp'
  });

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('transparent', false);
    }

    if (evt.type === 'didFocus' && evt.action.type === 'Navigation/COMPLETE_TRANSITION') {
      NearbyBeacons.stopScanning(() => {
        console.log('stopped scanning');
      });

      ref.current.animateNextTransition();
      setCompleted(true);
    }

    if (evt.type === 'willBlur' && evt.action.type === 'Navigation/BACK') {
      ref.current.animateNextTransition();
      setCompleted(false);
    }
  });

  const onStartQuestPressed = () => {
    NearbyBeacons.configureScanMode(2);
    NearbyBeacons.setDeviceUpdateCallbackInterval(2);

    NearbyBeacons.startScanning(() => {
      console.log('started scanning');
    });

    navigation.navigate(ScreenKeys.StepViewer, {
      quest,
      stepId: 1,
      token
    });
  };

  const transition = (
    <Transition.Together>
      <Transition.In type="slide-bottom" interpolation="easeInOut" durationMs={150} />
      <Transition.Change />
      <Transition.Out type="slide-bottom" interpolation="easeInOut" durationMs={20} />
    </Transition.Together>
  );

  return (
    <>
      <SharedElement id={`image_${quest.id}`} style={styles.fill}>
        <Image
          source={
            quest.id === 1
              ? {
                  uri:
                    'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/60362028_10158533718775550_8803879888109961216_o.jpg?_nc_cat=104&_nc_oc=AQmQMfZctOTQtPwGgxzvFlkHScDy1Mm99JorANofezjCo3MOQwMURwXdBpSHB94ukCg&_nc_ht=scontent-mxp1-1.xx&oh=8eb016ce727d45adb0131a08ca6b06cc&oe=5E230089'
                }
              : {
                  uri:
                    'https://static.wixstatic.com/media/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg/v1/fill/w_3360,h_840,al_c,q_90,usm_0.66_1.00_0.01/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg'
                }
          }
          style={styles.absoluteFill}
          resizeMode="cover"
        />
      </SharedElement>
      <SharedElement id={`gradient_${quest.id}`} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(51,51,51,0.64)', 'rgba(51,51,51,0.24)', Colors.BLACK]}
          locations={[0.1, 0.5, 0.83]}
          style={StyleSheet.absoluteFill}
        >
          <ScrollView
            style={{ marginTop: StatusBar.currentHeight }}
            contentContainerStyle={styles.scrollContainer}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }])}
          >
            <SharedElement id={`name_${quest.id}`}>
              <Text style={styles.questTitle}>{!isTransitionCompleted ? quest.name : ''}</Text>
            </SharedElement>
            <View style={styles.scrollContent}>
              <SharedElement id={`description_${quest.id}`}>
                <Text style={styles.questDescription}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum
                  ultrices. In nec velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa.
                  Vivamus eu ante at elit tempor fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in
                  nisi volutpat, non mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla
                  ultricies eros a lorem mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec
                  velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at
                  elit tempor fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in nisi volutpat, non
                  mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla ultricies eros a lorem
                  mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec velit ac nibh
                  ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at elit tempor
                  fermentum a nec nunc. Quisque fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in
                  nisi volutpat, non mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla
                  ultricies eros a lorem mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec
                  velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at
                  elit tempor fermentum a nec nunc. Quisquefermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper
                  diam in nisi volutpat, non mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien.
                  Nulla ultricies eros a lorem mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec
                  velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at
                  elit tempor fermentum a nec nunc. Quisquefermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper
                  diam in nisi volutpat, non mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien.
                  Nulla ultricies eros a lorem mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec
                  velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at
                  elit tempor fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in nisi volutpat, non
                  mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla ultricies eros a lorem
                  mollis egestas. Ut viverra ex sed ultrices sagittis.
                </Text>
              </SharedElement>
            </View>
          </ScrollView>
          {isTransitionCompleted && (
            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: headerOpacity
                  }
                ]}
              />
              <Animated.Text style={[styles.questTitle, { transform: [{ translateX: headerTranslate }] }]}>
                {quest.name}
              </Animated.Text>
            </Animated.View>
          )}
        </LinearGradient>
      </SharedElement>
      <Transitioning.View ref={ref} transition={transition} style={styles.footerContainer}>
        {isTransitionCompleted && (
          <LinearGradient colors={['rgba(51,51,51,0)', Colors.BLACK]} locations={[0, 0.3]} style={styles.fill}>
            <View style={styles.footer}>
              <Button mode="contained" dark={true} style={{ width: '100%' }} onPress={onStartQuestPressed}>
                {translate('start')}
              </Button>
            </View>
          </LinearGradient>
        )}
      </Transitioning.View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  absoluteFill: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: PADDING_BOTTOM_FIX,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  header: { backgroundColor: Colors.BLACK, position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_MAX_HEIGHT },
  scrollContainer: {
    paddingTop: DESIRED_DISTANCE,
    paddingHorizontal: 16,
    paddingBottom: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE
  },
  scrollContent: {
    paddingTop: 12
  },
  footerContainer: {
    height: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  footer: {
    height: FOOTER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    padding: 16,
    marginTop: FOOTER_SHADOW_DISTANCE
  },
  questTitle: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: Colors.WHITE,
    marginBottom: PADDING_BOTTOM_FIX
  },
  questDescription: { ...material.body1Object, color: Colors.WHITE }
});

QuestPreview.navigationOptions = {
  headerTransparent: true,
  headerTintColor: Colors.WHITE,
  headerLeftContainerStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 16,
    marginTop: 36 - StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_024,
    borderRadius: 40
  }
};

export default QuestPreview;
