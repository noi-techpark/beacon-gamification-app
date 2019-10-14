import to from 'await-to-js';
import find from 'lodash.find';
import React, { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getBeaconMetadataById } from '../../api/beacons';
import BeaconLocalizer from '../../components/BeaconLocalizer/BeaconLocalizer';
import { useDiscoveredBeacons } from '../../hooks/useDiscoveredBeacons';
import { Beacon, BeaconMedata } from '../../models/beacon';
import { Quest, QuestStep } from '../../models/quest';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';

interface StepViewerProps {}

const PADDING_BOTTOM_FIX = 4;
const DESIRED_DISTANCE = 350;
const FOOTER_SHADOW_DISTANCE = 35;
const FOOTER_HEIGHT = 92;
const HEADER_MAX_HEIGHT = DESIRED_DISTANCE + 56 + PADDING_BOTTOM_FIX + StatusBar.currentHeight - 12; // DO NOT ASK PLS
const HEADER_MIN_HEIGHT = 56 + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const StepViewer: StepViewerProps = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const stepId: number = useNavigationParam('stepId');
  const token: string = useNavigationParam('token');
  const currentPoints: number = useNavigationParam('points') || 0;
  const discoveredBeacons = useDiscoveredBeacons();

  const [targetBeacon, setTargetBeacon] = useState<BeaconMedata>();

  const [beaconFound, setBeaconFound] = useState<Beacon | undefined>(undefined);

  const scrollY = new Animated.Value(0);

  const step = quest.steps.find(s => s.quest_index === stepId);

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

  useEffect(() => {
    if (targetBeacon) {
      const beacon = find(discoveredBeacons, b => b.id === targetBeacon.beacon_id);

      if (beacon) {
        if (step.type === 'info') {
          navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
        } else {
          setBeaconFound(beacon);
        }
      }
    }
  }, [targetBeacon, discoveredBeacons]);

  useEffect(() => {
    const fetchBeacon = async () => {
      setBeaconFound(undefined);

      const [e, targetBeacon] = await to(getBeaconMetadataById(token, step.beacon));

      if (targetBeacon) {
        setTargetBeacon(targetBeacon);

        const alreadyFound = discoveredBeacons.find(b => b.id === targetBeacon.beacon_id);
        if (alreadyFound) {
          if (step.type === 'info') {
            navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
          } else {
            setBeaconFound(alreadyFound);
          }
        }
      }
    };

    fetchBeacon();
  }, [stepId]);

  async function onStepCompleted(step: QuestStep) {
    // await postAddPoints(token, step.value_points);

    if (step.quest_index < quest.steps.length) {
      navigation.navigate(ScreenKeys.QuestStepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token,
        points: currentPoints + step.value_points
      });
    } else {
      navigation.goBack();
      // navigation.state.params.onQuestCompleted(quest);
    }
  }

  const onSkipStepPressed = (step: QuestStep) => {
    if (step.quest_index < quest.steps.length) {
      navigation.navigate(ScreenKeys.QuestStepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token
      });
    } else {
      navigation.goBack();
      // navigation.state.params.onQuestCompleted(quest);
    }
  };

  function onCorrectAnswer(step: QuestStep) {
    navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
  }

  function onOpenQuestionPressed() {
    navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
  }

  return (
    <>
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
          <Text style={styles.stepTitle}>{''}</Text>
          <View style={styles.scrollContent}>
            <Text style={styles.stepDescription}>{step.instructions}</Text>
          </View>
        </ScrollView>
        <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity
              }
            ]}
          />
          <Animated.Text style={[styles.stepTitle, { transform: [{ translateX: headerTranslate }] }]}>
            {step.name}
          </Animated.Text>
        </Animated.View>
        <View style={styles.footerContainer}>
          <LinearGradient colors={['rgba(51,51,51,0)', Colors.BLACK]} locations={[0, 0.3]} style={styles.fill}>
            <View style={styles.footer}>
              <BeaconLocalizer beaconFound={beaconFound} onOpenQuestionPressed={onOpenQuestionPressed} />
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  absoluteFill: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  stepTitle: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: Colors.WHITE,
    marginBottom: PADDING_BOTTOM_FIX
  },
  stepDescription: { ...material.body1Object, color: Colors.WHITE },
  scrollContent: {
    paddingTop: 12
  },
  scrollContainer: {
    paddingTop: DESIRED_DISTANCE,
    paddingHorizontal: 16,
    paddingBottom: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE
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
    paddingHorizontal: 16,
    marginTop: FOOTER_SHADOW_DISTANCE
  }
});

StepViewer.navigationOptions = ({ navigation }) => {
  const points: number = navigation.getParam('points') || 0;

  return {
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
    },
    headerRight: (
      <View
        style={{
          width: 80,
          height: 32,
          marginHorizontal: 16,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 28 - StatusBar.currentHeight,
          borderRadius: 100,
          backgroundColor: Colors.WHITE_024
        }}
      >
        <Image source={require('../../images/star.png')} style={{ width: 16, height: 16 }} />
        <Text style={material.body1White}>{points}</Text>
      </View>
    )
  };
};

export default StepViewer;
