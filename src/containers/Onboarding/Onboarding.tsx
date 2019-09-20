import to from 'await-to-js';
import filter from 'lodash.filter';
import unionBy from 'lodash.unionby';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Button, DeviceEventEmitter, EmitterSubscription, FlatList, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { getAuthToken } from '../../api/auth';
import { getQuestFinder, getQuests } from '../../api/quests';
import PlatformTouchable from '../../common/PlatformTouchable/PlatformTouchable';
import { Beacon } from '../../models/beacon';
import { Quest, QuestFinder, QuestStep } from '../../models/quest';

const IBEACON_DISCOVERED = 'beaconDiscovered';
const IBEACON_LOST = 'beaconLost';

export interface IHomeProps {}

interface IState {
  isScanning: boolean;
  discoveredBeacons: Beacon[];
  quests: Quest[];
  token?: string;
  ongoingQuest?: Quest;
  beaconsToFind: QuestFinder[];
}

export default class Home extends PureComponent<IHomeProps, IState> {
  private subscriptions: EmitterSubscription[];

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      isScanning: false,
      discoveredBeacons: [],
      quests: [],
      beaconsToFind: []
    };
  }

  async componentDidMount() {
    this.subscriptions = [
      DeviceEventEmitter.addListener(IBEACON_DISCOVERED, async beacon => {
        // console.log('discovered');
        // console.log(beacon);
        this.setState({
          discoveredBeacons: unionBy(this.state.discoveredBeacons, [beacon], b => b.id)
        });

        const [e, found] = await to(getQuestFinder(this.state.token!, beacon.id));

        if (found) {
          this.setState({
            beaconsToFind: unionBy(this.state.beaconsToFind || [], [found], found => found.beacon.id)
          });
        }
      }),
      DeviceEventEmitter.addListener(IBEACON_LOST, beacon => {
        console.log('lost');
        console.log(beacon);
        this.setState({
          discoveredBeacons: filter(this.state.discoveredBeacons, b => b.id !== beacon.id),
          beaconsToFind: filter(this.state.beaconsToFind, b => b.beacon.beacon_id !== beacon.id)
        });
      })
    ];

    const hasPermission = await requestFineLocationPermission();

    if (!hasPermission) {
        // user has denied access to storage, show modal
        return Promise.reject('Permission denied');
    }

    const [e, r] = await to(getAuthToken('rizzo', 'rizzorizzorizzo'));

    if (r && r.token) {
      const [e, quests] = await to(getQuests(r.token));

      this.setState({
        quests,
        token: r.token
      });
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
  }

  render() {
    const { isScanning, quests, ongoingQuest, beaconsToFind } = this.state;

    return (
      <View style={styles.container}>
        {!ongoingQuest ? (
          <>
            <Text style={{ marginTop: 28 }}>🚀 Seleziona la tua avventura 🚀</Text>
            <FlatList<Quest>
              data={quests}
              keyExtractor={item => String(item.id)}
              style={{ width: '100%', marginTop: 12 }}
              renderItem={({ item }) => {
                return (
                  <PlatformTouchable
                    style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12 }}
                    onPress={() => this.onStartQuestPressed(item)}
                  >
                    <Text>{item.name}</Text>
                  </PlatformTouchable>
                );
              }}
            />
          </>
        ) : (
          <>
            <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ marginEnd: 16 }}>🚀 {ongoingQuest.name} 🚀</Text>
              {isScanning && <ActivityIndicator size="small" />}
              <Button title={isScanning ? 'Stop' : 'Scan'} onPress={this.onToggleScanningPressed} />
            </View>
            <FlatList<QuestStep>
              data={ongoingQuest.steps}
              keyExtractor={item => String(item.id)}
              style={{ width: '100%', marginTop: 12 }}
              renderItem={({ item }) => {
                return (
                  <PlatformTouchable
                    style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12 }}
                    onPress={() => this.onReachedStepPressed(item)}
                    disabled={!beaconsToFind.find(qf => qf.beacon.id === item.beacon)}
                  >
                    <>
                      <Text>{item.name}</Text>
                      {!!beaconsToFind.find(qf => qf.beacon.id === item.beacon) && <Text>TROVATO!</Text>}
                    </>
                  </PlatformTouchable>
                );
              }}
            />
          </>
        )}
      </View>
    );
  }

  private onToggleScanningPressed = async () => {
    if (!this.state.isScanning) {
      NearbyBeacons.startScanning(() => {
        this.setState({
          discoveredBeacons: [],
          isScanning: true
        });
      });
    } else {
      NearbyBeacons.stopScanning(() => {
        this.setState({
          isScanning: false
        });
      });
    }
  };

  private onStartQuestPressed = async (quest: Quest) => {
    await this.onToggleScanningPressed();

    this.setState({
      ongoingQuest: quest
    });
  };

  private onReachedStepPressed = async (step: QuestStep) => {
    alert(step.instructions);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

async function requestFineLocationPermission(): Promise<boolean> {
  try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'help',
          message: 'plz',
          buttonPositive: 'Si'
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return Promise.resolve(true);
      } else {
          return Promise.resolve(false);
      }
  } catch (err) {
      return Promise.resolve(false);
  }
}
