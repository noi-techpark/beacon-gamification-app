import React, { PureComponent } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { setupI18nConfig, translate } from '../../localization/locale';
import { ScreenKeys } from '../../screens';

export interface IOnboardingProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export default class Onboarding extends PureComponent<IOnboardingProps> {
  constructor(props: IOnboardingProps) {
    super(props);
    setupI18nConfig();
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={material.display3}>{translate('welcome')}</Text>
        <View style={{ marginBottom: 12 }}>
          <Button onPress={this.onStartOnboardingPressed} title={translate('start')} />
        </View>
      </View>
    );
  }

  private onStartOnboardingPressed = () => {
    this.props.navigation.navigate(ScreenKeys.Register);
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
