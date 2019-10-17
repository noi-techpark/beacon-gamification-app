import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { Question, QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const CorrectAnswer = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);

  const question: Question = JSON.parse(step.properties);

  // const locale = getCurrentLocale();

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      setScreenAppearing(true);
    } else if (evt.type === 'willBlur') {
      setScreenAppearing(false);
    } else if (evt.type === 'didFocus') {
      setCompleted(true);
    }
  });

  const fadeBackground = useAnimation({
    doAnimation: isScreenAppearing
  });

  const confettiAnimation = useAnimation({
    doAnimation: isTransitionCompleted,
    duration: 5000,
    easing: Easing.out(Easing.poly(2))
  });

  const fadeConfetti = useAnimation({
    doAnimation: isTransitionCompleted,
    delay: 5800 - 2000
  });

  async function onStepCompleted() {
    navigation.goBack();
    navigation.state.params.onStepCompleted(step);
  }

  return (
    <>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: fadeBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7]
            })
          }
        ]}
      />
      <Animated.View
        style={[
          styles.root,
          {
            transform: [
              {
                translateY: fadeBackground.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -Dimensions.get('window').height]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.cardContainer}>
          <LottieView
            source={require('../../../animations/confetti.json')}
            progress={confettiAnimation}
            resizeMode="cover"
          />
          <Animated.Image
            source={require('../../../images/confetti_win.png')}
            style={[
              styles.confetti,
              {
                opacity: fadeConfetti
              }
            ]}
            resizeMode="cover"
          />
          <Text style={styles.title}>{translate('gained')}</Text>
          <Text style={styles.description}>
            {question.answerExplanation ||
              `Il castello fu commissionato nel 1346 dall’illuminato marchese Luca Fedrizzi detto “Totto da Lona”. La costruzione durò 8 anni.`}
          </Text>
          <View style={styles.pointsContainer}>
            <Image source={require('../../../images/star_gradient.png')} />
            <Text style={styles.pointsText}>{step.value_points}</Text>
          </View>
          <Button onPress={onStepCompleted} mode="contained" dark={true}>
            {translate('proceed')}
          </Button>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 16,
    left: 0,
    right: 0,
    bottom: -Dimensions.get('window').height
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.TOTAL_BLACK,
    position: 'absolute'
  },
  confetti: {
    width: Dimensions.get('window').width - 32,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  cardContainer: {
    width: '100%',
    minHeight: 240,
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 8
  },
  title: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
    color: Colors.TOTAL_BLACK
  },
  description: {
    ...material.subheadingObject,
    paddingHorizontal: 16
  },
  pointsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 124,
    paddingHorizontal: 30,
    marginTop: 16,
    marginBottom: 48,
    borderRadius: 100,
    backgroundColor: ' rgba(222, 112, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pointsText: {
    ...material.display1WhiteObject,
    color: Colors.SUDTIROL_DARK_ORANGE,
    fontFamily: 'SuedtirolPro-Regular'
  }
});

export default CorrectAnswer;
