import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { material } from 'react-native-typography';
import { SharedElement } from 'react-navigation-shared-element';
import { Quest } from '../../models/quest';

interface QuestCardItemProps {
  quest: Quest;
  onOpenQuestPressed: () => void;
}

const QuestCardItem: React.FunctionComponent<QuestCardItemProps> = ({ quest, onOpenQuestPressed }) => {
  return (
    <Card onPress={onOpenQuestPressed} elevation={2} style={styles.questContainer}>
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
          style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          resizeMode="cover"
        />
      </SharedElement>
      <Card.Content style={{ paddingTop: 16 }}>
        <SharedElement id="name">
          <Text style={material.headline}>{quest.name}</Text>
        </SharedElement>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  questContainer: {
    marginVertical: 16
  }
});

export default React.memo(QuestCardItem);
