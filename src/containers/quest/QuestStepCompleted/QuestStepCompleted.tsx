import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Animated, Button, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const QuestStepCompleted = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);

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
    easing: Easing.out(Easing.poly(2)),
    delay: 800
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
          <Text style={material.title}>{translate('gained')}</Text>
          <Text style={material.display1}>{`${step.value_points} ${translate('points')}`}</Text>
          <Button title={translate('proceed')} onPress={onStepCompleted} />
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
    width: '100%',
    height: 240,
    position: 'absolute',
    top: 0
  },
  cardContainer: {
    // padding: 20,
    width: '100%',
    minHeight: 240,
    // marginHorizontal: 16,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  }
});

export default QuestStepCompleted;
