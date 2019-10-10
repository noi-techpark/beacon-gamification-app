import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useFocusState, useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';

const QuestPreview = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const token = useNavigationParam('token');
  const focusState = useFocusState();

  useEffect(() => {
    if (focusState.isFocusing) {
      NearbyBeacons.stopScanning(() => {
        console.log('stopped scanning');
      });
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('transparent', false);
    }
  }, [focusState]);

  const onStartQuestPressed = () => {
    NearbyBeacons.configureScanMode(2);
    NearbyBeacons.setDeviceupdateCallbackInterval(2);

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
    <>
      <SharedElement id="image" style={{ height: '100%', width: '100%' }}>
        <Image
          source={
            quest.id === 1
              ? {
                  uri:
                    // 'https://trento.impacthub.net/wp-content/uploads/sites/61/2015/10/hubtn_facciata02_low1-e1528807995616.jpg'
                    'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/60362028_10158533718775550_8803879888109961216_o.jpg?_nc_cat=104&_nc_oc=AQmQMfZctOTQtPwGgxzvFlkHScDy1Mm99JorANofezjCo3MOQwMURwXdBpSHB94ukCg&_nc_ht=scontent-mxp1-1.xx&oh=8eb016ce727d45adb0131a08ca6b06cc&oe=5E230089'
                }
              : {
                  uri:
                    'https://images.unsplash.com/photo-1509803874385-db7c23652552?ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80'
                }
          }
          style={{ height: '100%', width: '100%', position: 'absolute' }}
          resizeMode="cover"
        />
      </SharedElement>
      <SharedElement id={`gradient`} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(51,51,51,0.64)', 'rgba(51,51,51,0.24)']}
          locations={[0.1, 0.5]}
          style={StyleSheet.absoluteFill}
        >
          <ScrollView contentContainerStyle={{ paddingTop: 350, paddingHorizontal: 16, paddingBottom: 80 }}>
            <SharedElement id="name">
              <Text style={styles.questTitle}>{quest.name}</Text>
            </SharedElement>
            <SharedElement id="description">
              <Text style={styles.questDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum
                ultrices. In nec velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa.
                Vivamus eu ante at elit tempor fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in nisi
                volutpat, non mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla ultricies
                eros a lorem mollis egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum ultrices. In nec velit ac
                nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at elit tempor
                fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in nisi volutpat, non mollis dui
                sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla ultricies eros a lorem mollis
                egestas. Ut viverra ex sed ultrices sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus ultricies libero fermentum bibendum ultrices. In nec velit ac nibh ullamcorper consequat sit
                amet sit amet elit. Ut in venenatis massa. Vivamus eu ante at elit tempor fermentum a nec nunc. Quisque
                ut sem nunc. Etiam ullamcorper diam in nisi volutpat, non mollis dui sagittis. Duis vel condimentum
                lacus, eu sollicitudin sapien. Nulla ultricies eros a lorem mollis egestas. Ut viverra ex sed ultrices
                sagittis.
              </Text>
            </SharedElement>
          </ScrollView>
        </LinearGradient>
      </SharedElement>
      <LinearGradient
        colors={['rgba(51,51,51,0)', '#333333']}
        locations={[0, 0.3]}
        style={{
          width: '100%',
          height: 115,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <View style={{ height: 80, width: '100%', justifyContent: 'center', padding: 16, marginTop: 35 }}>
          <Button mode="contained" dark={true} style={{ width: '100%' }}>
            Ciao
          </Button>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  questTitle: { ...material.display1Object, fontFamily: 'SuedtirolPro-Regular', color: Colors.WHITE },
  questDescription: { ...material.body1Object, color: Colors.WHITE }
});

QuestPreview.navigationOptions = {
  headerTransparent: true
};

export default QuestPreview;
