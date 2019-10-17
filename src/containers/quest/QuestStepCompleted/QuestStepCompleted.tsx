import React, { useState } from 'react';
import { Animated, Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const QuestStepCompleted = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');
  const [isTransitionCompleted, setCompleted] = useState(false);

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      setCompleted(true);
    } else if (evt.type === 'willBlur') {
      setCompleted(false);
    }
  });

  const fadeBackground = useAnimation({
    doAnimation: isTransitionCompleted
    // easing: Easing.out(Easing.poly(4)),
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
      >
        <View style={{ width: '100%', height: '100%' }} />
      </Animated.View>
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
  cardContainer: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  }
});

export default QuestStepCompleted;
