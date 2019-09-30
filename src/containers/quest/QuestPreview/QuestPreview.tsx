import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { material } from 'react-native-typography';
import { useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';

const QuestPreview = () => {
  const quest: Quest = useNavigationParam('quest');

  async function onStartQuestPressed() {
    console.log(quest);
  }

  return (
    <View style={styles.root}>
      <View>
        <SharedElement id="name">
          <Text style={material.headline}>{quest.name}</Text>
        </SharedElement>
        <SharedElement id="image" style={{ height: 150, width: '100%', marginTop: 12 }}>
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
            style={{ height: '100%', width: '100%' }}
            resizeMode="cover"
          />
        </SharedElement>
      </View>
      <Button onPress={onStartQuestPressed} title={translate('start')} />
    </View>
  );
};

QuestPreview.sharedElements = () => [{ id: 'image' }, { id: 'name', animation: 'fade', resize: 'clip' }];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    // alignItems: 'center'
  }
});

export default QuestPreview;
