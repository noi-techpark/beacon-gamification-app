import to from 'await-to-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigationParam } from 'react-navigation-hooks';
import { getAuthToken } from '../../api/auth';
import { getQuests } from '../../api/quests';
import { PlatformTouchable } from '../../common/PlatformTouchable';
import { Avatar } from '../../components/Avatar';
import { Quest } from '../../models/quest';
import { Colors } from '../../styles/colors';
import { hashCode } from '../../utils/stringUtils';

const Home = () => {
  const username: string = useNavigationParam('username');
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const [e, token] = await to(getAuthToken(username, hashCode(username)));
      //   const [e, token] = await to(getAuthToken(username, 'rizzorizzorizzo'));

      if (token) {
        const [e, quests] = await to(getQuests(token));

        setQuests(quests);
      }
    };

    fetchQuests();
  }, []);

  return (
    <View style={styles.root}>
      <FlatList<Quest>
        data={quests}
        keyExtractor={item => String(item.id)}
        // style={{ width: '100%', marginTop: 12 }}
        style={{ flex: 1 }}
        ListHeaderComponent={AvatarRecap(username)}
        renderItem={({ item }) => {
          return (
            <PlatformTouchable style={styles.questContainer} onPress={() => this.onStartQuestPressed(item)}>
              <Text>{item.name}</Text>
            </PlatformTouchable>
          );
        }}
      />
    </View>
  );
};

const AvatarRecap = (username: string) => {
  return (
    <View style={{ flexDirection: 'row', marginHorizontal: 16, height: 64, borderRadius: 8 }}>
      <Avatar username={username} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },
  questContainer: {
    height: 180,
    elevation: 3,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  }
});

export default Home;
