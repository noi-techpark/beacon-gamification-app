import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';

interface IPointsPlaceholderProps {}

const PointsPlaceholder: React.FunctionComponent<IPointsPlaceholderProps> = () => (
  <View style={{ height: 204, backgroundColor: Colors.WHITE_032 }}>
    <View style={styles.root}>
      <View style={{ paddingHorizontal: 16 }}>
        <Text
          style={{
            ...material.body1Object,
            color: Colors.BLACK,
            width: Dimensions.get('window').width - 116 - 50,
            flexWrap: 'wrap'
          }}
        >
          {translate('points_placeholder')}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.WHITE,
          height: 124,
          marginRight: -18,
          width: 116
        }}
      >
        <Image source={require('../../images/zero_points_placeholder.png')} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginTop: 80,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default React.memo(PointsPlaceholder);
