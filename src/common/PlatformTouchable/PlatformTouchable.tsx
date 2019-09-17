import debounce from 'lodash.debounce';
import React from 'react';
import { GestureResponderEvent, Platform, StyleProp, TouchableNativeFeedback, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface IPlatformTouchableProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const PlatformTouchable = (props: IPlatformTouchableProps): JSX.Element => {
  const {
    //   raised,
    onPress,
    children,
    style,
    disabled
  } = props;

  // All Android Buttons should have the ripple effect
  if (Platform.OS === 'android') {
    // Normal Android buttons get a gray ripple
    return (
      <TouchableNativeFeedback
        onPress={onPress ? debounce(onPress, 500, { leading: true, trailing: false }) : undefined}
        // background={TouchableNativeFeedback.Ripple(Colors.GRAY_200)}
        useForeground={true}
        disabled={disabled}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  // Normal iOS buttons use TouchableOpacity
  return (
    <TouchableOpacity
      onPress={onPress ? debounce(onPress, 500, { leading: true, trailing: false }) : undefined}
      disabled={disabled}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export default PlatformTouchable;
