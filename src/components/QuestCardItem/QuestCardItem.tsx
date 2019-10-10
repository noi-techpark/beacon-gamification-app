import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
      <SharedElement id="image">
        <Card.Cover
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
          style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 164 }}
          resizeMode="cover"
        />
      </SharedElement>
      <Card.Content style={{ paddingTop: 12 }}>
        <SharedElement id="name">
          <Text style={styles.questTitle}>{quest.name}</Text>
        </SharedElement>
        <Text style={styles.questDescription} numberOfLines={2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies libero fermentum bibendum
          ultrices. In nec velit ac nibh ullamcorper consequat sit amet sit amet elit. Ut in venenatis massa. Vivamus eu
          ante at elit tempor fermentum a nec nunc. Quisque ut sem nunc. Etiam ullamcorper diam in nisi volutpat, non
          mollis dui sagittis. Duis vel condimentum lacus, eu sollicitudin sapien. Nulla ultricies eros a lorem mollis
          egestas. Ut viverra ex sed ultrices sagittis.
        </Text>
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
  questDescription: { ...material.body1Object, color: materialColors.blackSecondary }
});

export default React.memo(QuestCardItem);
