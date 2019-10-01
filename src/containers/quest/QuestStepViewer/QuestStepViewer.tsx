import to from 'await-to-js';
import filter from 'lodash.filter';
import unionBy from 'lodash.unionby';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getBeaconMetadataById } from '../../../api/beacons';
import { QuestStepFounder } from '../../../components/QuestStepFounder';
import { QuestStepQuestion } from '../../../components/QuestStepQuestion';
import { Beacon, BeaconMedata } from '../../../models/beacon';
import { Quest, QuestStep } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';

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
      setBeaconFound(false);

      const [e, beaconToReach] = await to(getBeaconMetadataById(token, step.beacon));

      if (beaconToReach) {
        setBeaconToReach(beaconToReach);

        NearbyBeacons.startScanning(() => {});
      }
    };

    fetchBeacon();
  }, [stepId]);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener(IBEACON_DISCOVERED, async (beacon: Beacon) => {
        setDiscoveredBeacons(unionBy(discoveredBeacons, [beacon], b => b.id));
        console.log(beacon);

        if (beaconToReach && beaconToReach.beacon_id === beacon.id) {
          NearbyBeacons.stopScanning(() => {});

          if (step.type === 'info') {
            navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
          } else {
            ref.current.animateNextTransition();
            setBeaconFound(true);
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

  function onStepCompleted(step: QuestStep) {
    // update topbar points
    if (step.quest_index < quest.steps.length) {
      NearbyBeacons.stopScanning(() => {});

      navigation.navigate(ScreenKeys.QuestStepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token
      });
    }
  }

  function onCorrectAnswer(step: QuestStep) {
    navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
  }

  const transition = (
    <Transition.Together>
      <Transition.Out type="slide-bottom" interpolation="easeInOut" durationMs={300} />
      <Transition.Out type="fade" durationMs={300} />
      <Transition.Change />
      <Transition.In type="slide-bottom" interpolation="easeInOut" delayMs={500} />
      <Transition.In type="fade" delayMs={500} />
    </Transition.Together>
  );

  return (
    <ScrollView
      style={styles.root}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flex: 1, alignItems: 'center' }}
    >
      <Text>{step.name}</Text>
      <Transitioning.View ref={ref} transition={transition} style={{ flexGrow: 1, width: '100%', marginTop: 24 }}>
        {!isBeaconFound ? (
          <QuestStepFounder step={step} />
        ) : (
          <QuestStepQuestion step={step} onCorrectAnswer={onCorrectAnswer} />
        )}
      </Transitioning.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 40
  }
});

export default QuestStepViewer;
