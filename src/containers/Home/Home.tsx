import to from 'await-to-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { material } from 'react-native-typography';
import { NavigationParams, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { getAuthToken, getUserDetail } from '../../api/auth';
import { getQuests } from '../../api/quests';
import { PlatformTouchable } from '../../common/PlatformTouchable';
import { Avatar } from '../../components/Avatar';
import { translate } from '../../localization/locale';
import { Quest } from '../../models/quest';
import { UserDetail } from '../../models/user';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
import { hashCode } from '../../utils/stringUtils';

const Home = () => {
  const navigation = useNavigation();
  const username: string = useNavigationParam('username');
  const [user, setUser] = useState<UserDetail>({ username });
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const [e, tokenResponse] = await to(getAuthToken(username, hashCode(username)));

      if (tokenResponse) {
        const { token, id } = tokenResponse;

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
        ListHeaderComponent={<AvatarRecap username={username} points={user.points} />}
        renderItem={({ item }) => renderItem(item, navigation)}
      />
    </View>
  );
};

const AvatarRecap = ({ username, points }) => (
  <View style={styles.avatarRecapContainer}>
    <Avatar username={username} />
    <View style={styles.userInfoContainer}>
      <Text style={material.subheading}>{username}</Text>
      <Text style={material.body1}>{`${points || 0} ${translate('points')}`}</Text>
    </View>
  </View>
);

const renderItem = (
  quest: Quest,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
) => {
  async function onOpenQuestPressed() {
    navigation.navigate(ScreenKeys.QuestPreview, {
      quest
    });
  }

  return (
    <PlatformTouchable style={styles.questContainer} onPress={onOpenQuestPressed}>
      <SharedElement id="image">
        <FastImage
          source={
            quest.id === 1
              ? {
                  uri:
                    'https://trento.impacthub.net/wp-content/uploads/sites/61/2015/10/hubtn_facciata02_low1-e1528807995616.jpg'
                }
              : {
                  uri:
                    'https://images.unsplash.com/photo-1509803874385-db7c23652552?ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80'
                }
          }
          style={{ height: 150, width: '100%' }}
          resizeMode="cover"
        />
      </SharedElement>
      <View style={styles.dataContainer}>
        <SharedElement id="name">
          <Text style={material.body1}>{quest.name}</Text>
        </SharedElement>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  avatarRecapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 8,
    height: 72,
    elevation: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BLACK_008,
    backgroundColor: Colors.WHITE
  },
  userInfoContainer: {
    paddingHorizontal: 16
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

export default Home;
