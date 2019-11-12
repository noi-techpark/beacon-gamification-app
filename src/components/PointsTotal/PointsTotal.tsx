import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

interface IPointsTotalProps {
  points: number;
}

const PointsTotal: React.FunctionComponent<IPointsTotalProps> = ({ points }) => (
  <View style={styles.root}>
    <Text style={{ ...material.captionObject, color: Colors.SUDTIROL_DARK_GREY }}>
      {translate('scored_points').toUpperCase()}
    </Text>
    <View style={styles.pointsContainer}>
      <Image source={require('../../images/star_gradient.png')} />
      <Text style={styles.pointsText}>{points || 0}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: { backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    alignItems: 'center',
    width: 137,
    height: 48,
    marginTop: 8,
    backgroundColor: 'rgba(222, 112, 0, 0.08)',
    borderRadius: 108
  },
  pointsText: {
    ...material.display1WhiteObject,
    color: Colors.SUDTIROL_DARK_ORANGE,
    fontFamily: 'SuedtirolPro-Regular'
  }
});

export default React.memo(PointsTotal);
