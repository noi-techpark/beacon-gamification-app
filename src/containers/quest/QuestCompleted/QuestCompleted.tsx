import React, { useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text } from 'react-native-paper';
import { material } from 'react-native-typography';
import { NavigationScreenComponent, NavigationScreenProps } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { NavigationStackOptions } from 'react-navigation-stack';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

interface IQuestCompletedProps extends NavigationScreenProps {
  // ... other props
}

const FOOTER_HEIGHT = 68;

const QuestCompleted: NavigationScreenComponent<NavigationStackOptions, IQuestCompletedProps> = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const points: number = useNavigationParam('points');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);

  useNavigationEvents(evt => {
    console.log(evt);

    if (evt.type === 'willFocus') {
      setScreenAppearing(true);
    } else if (evt.type === 'willBlur') {
      setScreenAppearing(false);
    } else if (evt.type === 'didFocus') {
      setCompleted(true);
    }
  });

  const opacity = useAnimation({
    doAnimation: isScreenAppearing
  });

  return (
    <>
      <Animated.Image
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
        resizeMode="cover"
        style={[styles.absoluteFill, { height: 348, opacity }]}
      />
      <LinearGradient
        colors={['rgba(51,51,51,0.48)', Colors.WHITE_048, Colors.WHITE]}
        locations={[0, 0.18, 0.4]}
        style={[styles.absoluteFill, { paddingTop: 265, paddingHorizontal: 16 }]}
      >
        <Text style={styles.title}>{translate('quest_completed', { quest_name: quest.name })}</Text>
      </LinearGradient>
      <View style={styles.footer}>
        <Button mode="contained" dark={true} style={{ width: '100%' }}>
          {translate('finish_quest')}
        </Button>
      </View>
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
  title: {
    ...material.headlineObject,
    fontFamily: 'SuedtirolPro-Regular',
    paddingHorizontal: 24,
    color: Colors.BLACK
  },
  footer: {
    height: FOOTER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 16,
    bottom: 0
  }
});

QuestCompleted.navigationOptions = {
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

export default QuestCompleted;
