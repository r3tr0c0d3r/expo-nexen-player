import React from 'react';
import {
  Animated,
  I18nManager,
  StyleSheet,
  View,
} from 'react-native';
import type { LineBarTheme } from '../utils/Theme';
import { boundPosition, trackToSeekValue } from '../utils/MathUtil';

export interface LineSeekBarTheme extends LineBarTheme {
  lineHeight?: number;
}

type LineSeekBarProps = {
  trackTime: number;
  totalTrackTime: number;
  layoutWidth: number;
  theme?: LineSeekBarTheme;
};

const LineSeekBar = (props: LineSeekBarProps) => {
  const { trackTime, totalTrackTime, layoutWidth, theme } = props;
  const isRTL = I18nManager.isRTL;
  const rtlMultiplier = isRTL ? -1 : 1;

  const seekWidth = React.useRef(new Animated.Value(0)).current;
  const seekableDistance = React.useRef(0);

  React.useEffect(() => {
    seekableDistance.current = layoutWidth * rtlMultiplier;
    const position = boundPosition(
      trackToSeekValue(trackTime, totalTrackTime, seekableDistance.current),
      seekableDistance.current
    );
    seekWidth.setValue(position * rtlMultiplier);
  }, [trackTime, totalTrackTime, layoutWidth]);
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.totalTrack,
          {
            height: theme?.lineHeight,
            borderRadius: theme?.lineHeight! / 2,
            backgroundColor: theme?.lineUnderlayColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.track,
          {
            width: seekWidth,
            height: theme?.lineHeight,
            borderRadius: theme?.lineHeight! / 2,
            backgroundColor: theme?.lineColor,
          },
        ]}
      />
    </View>
  );
};

export default LineSeekBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 999,
  },
  totalTrack: {
    position: 'absolute',
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
});
