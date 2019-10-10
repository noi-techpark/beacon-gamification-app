/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator } from 'react-navigation-stack';
import { TransitionProps } from 'react-navigation-stack/lib/typescript/types';
import { Home } from './src/containers/Home';
import { Onboarding } from './src/containers/Onboarding';
import { QuestPreview } from './src/containers/quest/QuestPreview';
import { QuestStepCompleted } from './src/containers/quest/QuestStepCompleted';
import { QuestStepViewer } from './src/containers/quest/QuestStepViewer';
import { Register } from './src/containers/Register';
import { setupI18nConfig } from './src/localization/locale';
import { ScreenKeys } from './src/screens';
import { Colors } from './src/styles/colors';
import { forVertical, springyFadeIn } from './src/utils/animations';

// StatusBar.setTranslucent(true);
StatusBar.setBarStyle('dark-content');
StatusBar.setBackgroundColor(Colors.GRAY_200);

const AppNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    [ScreenKeys.Home]: {
      screen: Home
    },
    [ScreenKeys.Onboarding]: {
      screen: Onboarding
    },
    [ScreenKeys.Register]: {
      screen: Register
    },
    [ScreenKeys.QuestPreview]: {
      screen: QuestPreview
    },
    [ScreenKeys.QuestStepViewer]: {
      screen: QuestStepViewer
    }
  },
  {
    initialRouteName: ScreenKeys.Onboarding,
    defaultNavigationOptions: {
      headerStyle: {
        elevation: 0,
        backgroundColor: 'transparent'
        // marginTop: StatusBar.currentHeight
      }
    },
    transitionConfig: (toProps: TransitionProps, fromProps: TransitionProps) => {
      if (
        fromProps &&
        ((fromProps.scene.route.routeName === ScreenKeys.Home &&
          toProps.scene.route.routeName === ScreenKeys.QuestPreview) ||
          (fromProps.scene.route.routeName === ScreenKeys.QuestPreview &&
            toProps.scene.route.routeName === ScreenKeys.Home))
      ) {
        return springyFadeIn();
      }
    }
  }
);

const ModalNavigator = createStackNavigator(
  {
    Main: {
      screen: AppNavigator
    },
    [ScreenKeys.QuestStepCompleted]: {
      screen: QuestStepCompleted
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    gesturesEnabled: false,
    transparentCard: true,
    transitionConfig: () => forVertical()
  }
);

setupI18nConfig();

export default createAppContainer(ModalNavigator);
