import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { translate } from '../../../localization/locale';
import { QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const QuestStepCompleted = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');

  async function onStepCompleted() {
    navigation.goBack();
    navigation.state.params.onStepCompleted(step);
  }

  return (
    <View style={styles.root}>
      <View style={styles.cardContainer}>
        <Text style={material.title}>{translate('gained')}</Text>
        <Text style={material.display1}>{`${step.value_points} ${translate('points')}`}</Text>
        <Button title={translate('proceed')} onPress={onStepCompleted} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor: Colors.BLACK,
    alignItems: 'center',
    justifyContent: 'center'
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
