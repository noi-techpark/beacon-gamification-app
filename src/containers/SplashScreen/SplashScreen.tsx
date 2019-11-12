import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { ScreenKeys } from '../../screens';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigateToOnboarding();
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  async function onNavigateToOnboarding() {
    navigation.navigate(ScreenKeys.Onboarding);
  }

  return (
    <View style={styles.root}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../images/noi_logo.png')} resizeMode="center" />
        <Image source={require('../../images/beacon_logo.png')} resizeMode="center" />
        <Image source={require('../../images/efre_logo.png')} resizeMode="center" />
      </View>
      <Image source={require('../../images/mountains.png')} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between'
  }
});

SplashScreen.navigationOptions = {
  header: null
};

export default SplashScreen;
