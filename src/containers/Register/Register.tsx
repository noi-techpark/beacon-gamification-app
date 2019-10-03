import to from 'await-to-js';
import React, { useState } from 'react';
import { Button, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput } from 'react-native';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import { getAuthToken, postAddUserToGroup, postCreateUser } from '../../api/auth';
import { CircleAvatar } from '../../components/CircleAvatar';
import { translate } from '../../localization/locale';
import { ApiError, isUsernameAlreadyExisiting } from '../../models/error';
import { User } from '../../models/user';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  async function onSignInPressed() {
    Keyboard.dismiss();

    const { token } = await getAuthToken('rizzo', 'rizzorizzorizzo');
    const [err, user] = await to<User, ApiError>(postCreateUser(token, username));

    if (err && isUsernameAlreadyExisiting(err)) {
      // check if already registered user
      navigation.navigate(ScreenKeys.Home, {
        username
      });
    }

    if (user) {
      const isAdded = await postAddUserToGroup(token, user.id);

      if (isAdded) {
        navigation.navigate(ScreenKeys.Home, {
          username: user.username
        });
      }
    } else {
      // show notification error
    }
  }

  return (
    <ScrollView
      style={styles.root}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <CircleAvatar username={username} />
      <Text style={{ ...material.headlineObject, marginTop: 8 }}>{translate('insert_username')}</Text>
      <TextInput
        onChangeText={username => setUsername(username)}
        value={username}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.usernameInput}
        selectionColor={Colors.BLUE_500}
        underlineColorAndroid={Colors.BLUE_500}
        autoFocus={true}
        placeholder="mario.rossi@test.com"
      />
      <Button title={translate('signin')} onPress={onSignInPressed} />
    </ScrollView>
  );
};

Register.navigationOptions = {
  headerStyle: {
    // backgroundColor: Colors.WHITE,
    elevation: 0,
    marginTop: StatusBar.currentHeight,
    // height: 
  },
  // headerTransparent: true,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16
  },
  usernameInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  }
});

export default Register;
