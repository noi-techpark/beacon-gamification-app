import to from 'await-to-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NavigationParams, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getAuthToken, getUserDetail } from '../../api/auth';
import { getQuests } from '../../api/quests';
import { QuestCardItem } from '../../components/QuestCardItem';
import { UserRecap } from '../../components/UserRecap';
import { Quest } from '../../models/quest';
import { UserDetail } from '../../models/user';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
import { hashCode } from '../../utils/stringUtils';

const Home = () => {
  const navigation = useNavigation();
  const username: string = useNavigationParam('username');
  const [user, setUser] = useState<UserDetail>({ username });
  const [token, setToken] = useState('');
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const [e, tokenResponse] = await to(getAuthToken(username, hashCode(username)));

      if (tokenResponse) {
        const { token, id } = tokenResponse;

        setToken(token);

        const user = await getUserDetail(token, id);
        const [e, quests] = await to(getQuests(token));

        setUser(user);
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
        style={{ paddingTop: 16 }}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={<UserRecap username={username} points={user.points} />}
        renderItem={({ item }) => renderItem(item, token, navigation)}
      />
    </View>
  );
};

const renderItem = (
  quest: Quest,
  token: string,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
) => {
  async function onOpenQuestPressed() {
    navigation.navigate(ScreenKeys.QuestPreview, {
      quest,
      token
    });
  }

  return <QuestCardItem quest={quest} onOpenQuestPressed={onOpenQuestPressed} />;
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  questContainer: {
    margin: 16,
    height: 200,
    elevation: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BLACK_008,
    backgroundColor: Colors.WHITE
  },
  dataContainer: { paddingHorizontal: 16, justifyContent: 'center', height: 50 }
});

Home.navigationOptions = {
  cardStyle: {
    backgroundColor: Colors.WHITE
  }
};

Home.sharedElements = () => [{ id: 'image' }, { id: 'name', animation: 'fade', resize: 'clip' }];

export default Home;
