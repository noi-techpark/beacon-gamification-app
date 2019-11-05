import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

interface IPointsRecapProps {
  points: number;
}

const PointsRecap: React.FunctionComponent<IPointsRecapProps> = ({ points }) => (
  <View style={{ height: 204 }}>
    {/* <PatternBackground
      pattern={require('../../images/points_pattern.png')}
      colors={[Colors.WHITE, Colors.WHITE_000]}
      locations={[0.34, 0.52]}
    > */}
    <View style={styles.root}>
      <Text style={{ ...material.captionObject, color: Colors.SUDTIROL_DARK_GREY }}>
        {translate('current_points').toUpperCase()}
      </Text>
      <View style={styles.pointsContainer}>
        <Image source={require('../../images/star.png')} />
        <Text style={styles.pointsText}>{points || 0}</Text>
      </View>
    </View>
    {/* </PatternBackground> */}
  </View>
);

const styles = StyleSheet.create({
  root: { marginTop: 108, backgroundColor: 'transparent', alignItems: 'center' },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    width: 155,
    marginTop: 4,
    backgroundColor: Colors.SUDTIROL_DARK_ORANGE,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'rgba(222, 112, 0, 0.24)'
  },
  pointsText: {
    ...material.display1WhiteObject,
    color: Colors.WHITE,
    fontFamily: 'SuedtirolPro-Regular'
  }
});

export default React.memo(PointsRecap);
