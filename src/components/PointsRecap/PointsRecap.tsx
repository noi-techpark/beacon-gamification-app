import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { PatternBackground } from '../../common/PatternBackground';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

interface IPointsRecapProps {
  points: number;
}

const PointsRecap: React.FunctionComponent<IPointsRecapProps> = ({ points }) => (
  <View style={{ height: 180 }}>
    <PatternBackground
      pattern={require('../../images/points_pattern.png')}
      colors={[Colors.WHITE, Colors.WHITE_000]}
      locations={[0.32, 0.52]}
    >
      <View style={styles.root}>
        <Text style={{ ...material.captionObject, color: Colors.SUDTIROL_DARK_GREY }}>
          {translate('current_points').toUpperCase()}
        </Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{points || 0}</Text>
        </View>
      </View>
    </PatternBackground>
  </View>
);

const styles = StyleSheet.create({
  root: { marginTop: 84, backgroundColor: 'transparent', alignItems: 'center' },
  pointsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    marginTop: 4,
    backgroundColor: Colors.SUDTIROL_GREEN,
    borderRadius: 8,
    elevation: 12
  },
  pointsText: {
    ...material.display1WhiteObject,
    color: Colors.WHITE,
    fontFamily: 'SuedtirolPro-Regular'
  }
});

export default React.memo(PointsRecap);
