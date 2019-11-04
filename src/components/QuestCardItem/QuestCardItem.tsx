import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { material, materialColors } from 'react-native-typography';
import { SharedElement } from 'react-navigation-shared-element';
import { translate } from '../../localization/locale';
import { Quest } from '../../models/quest';
import { Colors } from '../../styles/colors';

interface QuestCardItemProps {
  quest: Quest;
  onOpenQuestPressed: () => void;
}

const QuestCardItem: React.FunctionComponent<QuestCardItemProps> = ({ quest, onOpenQuestPressed }) => {
  return (
    <Card elevation={3} style={styles.questContainer}>
      <SharedElement id={`gradient_${quest.id}`} style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill} collapsable={false} />
      </SharedElement>
      <SharedElement id={`image_${quest.id}`}>
        <Card.Cover
          source={
            quest.id === 1
              ? {
                  uri:
                    // 'https://trento.impacthub.net/wp-content/uploads/sites/61/2015/10/hubtn_facciata02_low1-e1528807995616.jpg'
                    'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/60362028_10158533718775550_8803879888109961216_o.jpg?_nc_cat=104&_nc_oc=AQmQMfZctOTQtPwGgxzvFlkHScDy1Mm99JorANofezjCo3MOQwMURwXdBpSHB94ukCg&_nc_ht=scontent-mxp1-1.xx&oh=8eb016ce727d45adb0131a08ca6b06cc&oe=5E230089'
                }
              : {
                  uri:
                    // 'https://images.unsplash.com/photo-1509803874385-db7c23652552?ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80'
                    'https://static.wixstatic.com/media/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg/v1/fill/w_3360,h_840,al_c,q_90,usm_0.66_1.00_0.01/9508b7_6810120813944ffb801e83ce6e4cca2a~mv2.jpg'
                }
          }
          style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 164 }}
          resizeMode="cover"
        />
      </SharedElement>
      <Card.Content style={{ paddingTop: 12 }}>
        <SharedElement id={`name_${quest.id}`}>
          <Text style={styles.questTitle}>{quest.name}</Text>
        </SharedElement>
        <SharedElement id={`description_${quest.id}`}>
          <Text style={styles.questDescription} numberOfLines={2}>
            {quest.description}
          </Text>
        </SharedElement>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onOpenQuestPressed} color={Colors.SUDTIROL_DARK_GREEN}>
          {translate('discover')}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  questContainer: {
    marginVertical: 8,
    height: 304
  },
  questTitle: { ...material.headlineObject, fontFamily: 'SuedtirolPro-Regular' },
  questDescription: { ...material.body1Object, color: materialColors.blackSecondary, height: 40 }
});

export default React.memo(QuestCardItem);
