import to from 'await-to-js';
import filter from 'lodash.filter';
import unionBy from 'lodash.unionby';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getBeaconMetadataById } from '../../../api/beacons';
import { Beacon, BeaconMedata } from '../../../models/beacon';
import { Quest, QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const IBEACON_DISCOVERED = 'beaconDiscovered';
const IBEACON_LOST = 'beaconLost';

const QuestStepViewer = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const stepId: number = useNavigationParam('stepId');
  const token: string = useNavigationParam('token');
  const [discoveredBeacons, setDiscoveredBeacons] = useState<Beacon[]>([]);
  const [beaconToReach, setBeaconToReach] = useState<BeaconMedata>();
  const [isBeaconFound, setBeaconFound] = useState(false);
  const ref = useRef<TransitioningView>();

  const step = quest.steps.find(s => s.id === stepId);

  useEffect(() => {
    const fetchBeacon = async () => {
      const [e, beaconToReach] = await to(getBeaconMetadataById(token, step.beacon));

      if (beaconToReach) {
        setBeaconToReach(beaconToReach);

        NearbyBeacons.startScanning(() => {});
      }
    };

    fetchBeacon();
  }, []);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener(IBEACON_DISCOVERED, async (beacon: Beacon) => {
        setDiscoveredBeacons(unionBy(discoveredBeacons, [beacon], b => b.id));
        console.log(beacon);

        if (beaconToReach && beaconToReach.beacon_id === beacon.id) {
          ref.current.animateNextTransition();
          setBeaconFound(true);

          NearbyBeacons.stopScanning(() => {});

          if (step.type === 'info') {
            navigation.navigate('QuestStepCompleted', { step });
          }
        }
      }),
      DeviceEventEmitter.addListener(IBEACON_LOST, beacon => {
        setDiscoveredBeacons(filter(this.state.discoveredBeacons, b => b.id !== beacon.id));
      })
    ];

    return () => {
      subscriptions.forEach(s => s.remove());
    };
  }, [beaconToReach]);

  const transition = (
    <Transition.Together>
      <Transition.Out type="slide-top" interpolation="easeInOut" durationMs={300} />
      <Transition.Out type="fade" durationMs={300} />
      <Transition.In type="slide-bottom" interpolation="easeInOut" delayMs={500} />
      <Transition.In type="fade" delayMs={500} />
    </Transition.Together>
  );

  return (
    <View style={styles.root}>
      <Text>{step.name}</Text>
      <Transitioning.View ref={ref} transition={transition}>
        {!isBeaconFound ? ScanningLoader() : QuestStepQuestion(step)}
      </Transitioning.View>
      <Text>{step.instructions}</Text>
    </View>
  );
};

const ScanningLoader = () => {
  return <ActivityIndicator size="large" color={Colors.BLUE_500} />;
};

const QuestStepQuestion = (step: QuestStep) => {
  return <Text>{step.type}</Text>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default QuestStepViewer;
