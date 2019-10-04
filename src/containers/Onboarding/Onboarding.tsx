import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import { translate } from '../../localization/locale';
import { ScreenKeys } from '../../screens';
import { requestFineLocationPermission } from '../../utils/permissions';

const Onboarding = () => {
  const navigation = useNavigation();

  async function onStartOnboardingPressed() {
    const hasPermissions = await requestFineLocationPermission();

    if (hasPermissions) {
      navigation.navigate(ScreenKeys.Register);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={{ ...material.display2Object, marginBottom: 32 }}>{translate('welcome')}</Text>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <>
          <Text style={material.headline}>{translate('onboarding')}</Text>
          <Text style={material.subheading}>{translate('ask_permission')}</Text>
        </>
        <Button onPress={onStartOnboardingPressed} mode="contained">
          {translate('start')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  }
});

export default Onboarding;
