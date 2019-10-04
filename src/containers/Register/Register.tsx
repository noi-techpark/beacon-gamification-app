import to from 'await-to-js';
import React, { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import * as yup from 'yup';
import { getAuthToken, postAddUserToGroup, postCreateUser } from '../../api/auth';
import { CircleAvatar } from '../../components/CircleAvatar';
import { translate } from '../../localization/locale';
import { ApiError, isUsernameAlreadyExisiting } from '../../models/error';
import { User } from '../../models/user';
import { ScreenKeys } from '../../screens';

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [isValid, setValid] = useState(true);

  const schema = yup.object().shape({
    username: yup
      .string()
      .email()
      .required()
  });

  async function onSignInPressed() {
    Keyboard.dismiss();

    setValid(
      schema.isValidSync({
        username
      })
    );

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
      <Text style={{ ...material.headlineObject, marginTop: 16 }}>{translate('insert_username')}</Text>
      <View style={styles.formContainer}>
        <TextInput
          value={username}
          onChangeText={username => {
            setUsername(username);
            setValid(true);
          }}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.usernameInput}
          autoFocus={true}
          error={!isValid}
          label="email"
        />
        <HelperText type="error" visible={!isValid}>
          {translate('email_invalid')}
        </HelperText>
      </View>
      <Button
        onPress={onSignInPressed}
        mode="contained"
        style={styles.signinButton}
        contentStyle={{ paddingHorizontal: 20 }}
      >
        {translate('signin')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16
  },
  formContainer: { width: '100%', marginVertical: 16 },
  usernameInput: {
    width: '100%'
  },
  signinButton: { width: '100%', marginTop: 24 }
});

export default Register;
