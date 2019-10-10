import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import { PatternBackground } from '../../common/PatternBackground';
import { translate } from '../../localization/locale';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
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
    <PatternBackground>
      <View style={styles.root}>
        <Image
          source={require('../../images/sudtirol_logo.png')}
          style={{ alignSelf: 'center', marginTop: -10 }}
          resizeMode="center"
        />
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{translate('welcome')}</Text>
          <Text style={{ ...material.body1Object, marginTop: 12, marginBottom: 32 }}>{translate('onboarding')}</Text>
          <Button onPress={onStartOnboardingPressed} mode="contained" color={Colors.SUDTIROL_GREEN} dark={true}>
            {translate('start')}
          </Button>
        </View>
      </View>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between'
  },
  title: {
    ...material.display2Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: Colors.BLACK
  }
});

Onboarding.navigationOptions = {
  header: null
};

export default Onboarding;
