import to from 'await-to-js';
import filter from 'lodash.filter';
import find from 'lodash.find';
import sortBy from 'lodash.sortby';
import sumBy from 'lodash.sumby';
import unionBy from 'lodash.unionby';
import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getBeaconMetadataById } from '../../../api/beacons';
import PlatformTouchable from '../../../common/PlatformTouchable/PlatformTouchable';
import { QuestStepFinder } from '../../../components/QuestStepFinder';
import { QuestStepQuestion } from '../../../components/QuestStepQuestion';
import { Beacon, BeaconMedata } from '../../../models/beacon';
import { Quest, QuestStep } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';

const IBEACON_DISCOVERED = 'beaconDiscovered';
const IBEACONS_UPDATED = 'beaconsUpdated';
const IBEACON_LOST = 'beaconLost';

const QuestStepViewer = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const stepId: number = useNavigationParam('stepId');
  const token: string = useNavigationParam('token');
  const points: number = useNavigationParam('points') || 0;
  const [discoveredBeacons, setDiscoveredBeacons] = useState<Beacon[]>([]);
  const [beaconToReach, setBeaconToReach] = useState<BeaconMedata>();
  const [beaconFound, setBeaconFound] = useState<{
    distance: number;
    range: 'immediate' | 'near' | 'far' | 'unknown';
  }>({
    range: 'unknown',
    distance: 0
  });
  const ref = useRef<TransitioningView>();

  const step = quest.steps.find(s => s.quest_index === stepId);

  useEffect(() => {
    const fetchBeacon = async () => {
      setBeaconFound({
        range: 'unknown',
        distance: 0
      });

      const [e, beaconToReach] = await to(getBeaconMetadataById(token, step.beacon));

      if (beaconToReach) {
        setBeaconToReach(beaconToReach);

        const alreadyFound = discoveredBeacons.find(b => b.id === beaconToReach.beacon_id);
        if (alreadyFound) {
          if (step.type === 'info') {
            navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
          } else {
            ref.current.animateNextTransition();
            setBeaconFound({
              range: alreadyFound.range,
              distance: alreadyFound.distance
            });
          }
        }
      }
    };

    fetchBeacon();
  }, [stepId]);

  useEffect(() => {
    const subscriptions = [
      DeviceEventEmitter.addListener(IBEACON_DISCOVERED, async (beacon: Beacon) => {
        setDiscoveredBeacons(sortBy(unionBy(discoveredBeacons, [beacon], b => b.id), b => b.distance));

        if (beaconToReach && beaconToReach.beacon_id === beacon.id) {
          if (step.type === 'info') {
            navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
          } else {
            ref.current.animateNextTransition();
            setBeaconFound({
              range: beacon.range,
              distance: beacon.distance
            });
          }
        }
      }),
      DeviceEventEmitter.addListener(IBEACONS_UPDATED, ({ beacons }) => {
        setDiscoveredBeacons(sortBy(unionBy(beacons, discoveredBeacons, b => b.id), b => b.distance));

        if (beaconToReach) {
          const beacon = find(discoveredBeacons, b => b.id === beaconToReach.beacon_id);
          if (beacon) {
            if (step.type === 'info') {
              navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
            } else {
              ref.current.animateNextTransition();
              setBeaconFound({
                range: beacon.range,
                distance: beacon.distance
              });
            }
          }
        }
      }),
      DeviceEventEmitter.addListener(IBEACON_LOST, beacon => {
        setDiscoveredBeacons(filter(discoveredBeacons, b => b.id !== beacon.id));
      })
    ];

    return () => {
      subscriptions.forEach(s => s.remove());
    };
  }, [beaconToReach, discoveredBeacons]);

  async function onStepCompleted(step: QuestStep) {
    // await postAddPoints(token, step.value_points);

    if (step.quest_index < quest.steps.length) {
      navigation.navigate(ScreenKeys.StepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token,
        points: points + step.value_points
      });
    } else {
      navigation.goBack();
      // navigation.state.params.onQuestCompleted(quest);
    }
  }

  const onSkipStepPressed = (step: QuestStep) => {
    if (step.quest_index < quest.steps.length) {
      navigation.navigate(ScreenKeys.StepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token
      });
    } else {
      navigation.goBack();
      // navigation.state.params.onQuestCompleted(quest);
    }
  };

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
        {beaconFound.distance >= 0.5 || beaconFound.distance === 0 ? (
          <QuestStepFinder step={step} distance={beaconFound.distance} />
        ) : (
          <QuestStepQuestion step={step} onCorrectAnswer={onCorrectAnswer} />
        )}
      </Transitioning.View>
      <PlatformTouchable
        onPress={() => onSkipStepPressed(step)}
        style={{ marginTop: 24, height: 20, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ ...material.body1Object, color: Colors.BLUE_500 }}>Salta passo</Text>
      </PlatformTouchable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 40
  }
});

QuestStepViewer.navigationOptions = ({ navigation }) => {
  const quest: Quest = navigation.getParam('quest');
  const points: number = navigation.getParam('points') || 0;

  const totalQuestPoints = sumBy(quest.steps, s => s.value_points);
  const percentage = (points / totalQuestPoints) * 100;

  return {
    headerTitle: (
      <View style={{ width: '90%' }}>
        <Text>{quest.name}</Text>
        <View style={{ height: 10, width: '100%', borderColor: Colors.BLACK, borderWidth: 1 }}>
          <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: Colors.BLUE_500 }} />
        </View>
      </View>
    )
  };
};

export default QuestStepViewer;
