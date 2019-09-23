import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
import { firstLetter } from '../../utils/stringUtils';

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (username) {
      setUsername(username);
    }
  }, [username]);

  function onSignInPressed() {
    navigation.navigate(ScreenKeys.Home, { text: 'Hi!' });
  }

  return (
    <ScrollView
      style={styles.root}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={styles.avatarContainer}>{!!username && <Text style={material.display1White}>{firstLetter(username)}</Text>}</View>
      <Text style={material.headline}>Inserisci il tuo nome utente</Text>
      <TextInput
        onChangeText={text => setUsername(text)}
        value={username}
        style={styles.usernameInput}
        selectionColor={Colors.BLUE_500}
        underlineColorAndroid={Colors.BLUE_500}
        placeholder="mario.rossi@test.com"
      />
      <Button title="Accedi" onPress={onSignInPressed} />
    </ScrollView>
  );
};

Register.navigationOptions = {
  title: ''
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
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.BLUE_500,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  }
});

export default Register;
