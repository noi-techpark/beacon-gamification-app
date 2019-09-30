import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { translate } from '../../../localization/locale';
import { Colors } from '../../../styles/colors';

const QuestStepCompleted = () => {
  const navigation = useNavigation();

  async function onStepCompleted() {
    navigation.goBack();
  }

  return (
    <View style={styles.root}>
      <View style={{ padding: 20, backgroundColor: Colors.WHITE }}>
        <Text>{translate('found')}</Text>
        <Button title={translate('go')} onPress={onStepCompleted} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default QuestStepCompleted;
