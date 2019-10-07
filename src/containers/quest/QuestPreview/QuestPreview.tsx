import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useFocusState, useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';

const QuestPreview = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const token = useNavigationParam('token');
  const focusState = useFocusState();

  useEffect(() => {
    if (focusState.isFocused) {
      NearbyBeacons.stopScanning(() => {
        console.log('stopped scanning');
      });
    }
  }, [focusState]);

  const onStartQuestPressed = () => {
    NearbyBeacons.configureScanMode(2);
    
    NearbyBeacons.startScanning(() => {
      console.log('started scanning');
    });

    navigation.navigate(ScreenKeys.QuestStepViewer, {
      quest,
      stepId: 1,
      token
    });
  };

  return (
    <View style={styles.root}>
      <View>
        <SharedElement id="name">
          <Text style={material.headline}>{quest.name}</Text>
        </SharedElement>
        <SharedElement id="image" style={{ height: 150, width: '100%', marginTop: 12 }}>
          <Image
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
      <Button onPress={onStartQuestPressed} mode="contained">
        {translate('start')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between'
    // alignItems: 'center'
  }
});

export default QuestPreview;
