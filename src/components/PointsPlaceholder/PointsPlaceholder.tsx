import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { PatternBackground } from '../../common/PatternBackground';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

interface IPointsPlaceholderProps {}

const PointsPlaceholder: React.FunctionComponent<IPointsPlaceholderProps> = () => (
  <View style={{ height: 204 }}>
    <PatternBackground
      pattern={require('../../images/points_pattern.png')}
      colors={[Colors.WHITE, Colors.WHITE_000]}
      locations={[0.34, 0.52]}
    >
      <View style={styles.root}>
        <Text style={{ ...material.body1Object, color: Colors.BLACK }}>{translate('points_placeholder')}</Text>
        <Image source={{ uri: require('../../images/zero_points_placeholder.png') }} />
      </View>
    </PatternBackground>
  </View>
);

const styles = StyleSheet.create({
  root: { marginTop: 108, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-between' }
});

export default React.memo(PointsPlaceholder);
