/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Home } from './src/containers/Home';
import { Onboarding } from './src/containers/Onboarding';
import { Register } from './src/containers/Register';
import { setupI18nConfig } from './src/localization/locale';
import { ScreenKeys } from './src/screens';

const AppNavigator = createStackNavigator(
  {
    [ScreenKeys.Home]: {
      screen: Home
    },
    [ScreenKeys.Onboarding]: {
      screen: Onboarding
    },
    [ScreenKeys.Register]: {
      screen: Register
    }
  },
  {
    initialRouteName: ScreenKeys.Onboarding
  }
);

setupI18nConfig();

export default createAppContainer(AppNavigator);
