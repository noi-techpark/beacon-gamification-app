import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { Colors } from '../../styles/colors';
import { firstLetter } from '../../utils/stringUtils';

interface AvatarProps {
  username?: string;
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ username }) => {
  return (
    <View style={styles.avatarContainer}>
      {!!username && <Text style={material.display1White}>{firstLetter(username)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.BLUE_500,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default React.memo(Avatar);
