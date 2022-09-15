import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import SeekBar, { SeekBarTheme } from './SeekBar';
import IconButton from './IconButton';
import { getVolumeIcon } from '../utils/ComponentUtil';
import { IconVolume } from '../assets/icons';
import type { MiniSeekBarTheme, TagViewTheme } from '../utils/Theme';

export interface VolumeTagViewTheme extends TagViewTheme, MiniSeekBarTheme {

}
type VolumeTagViewProps = {
  volume: number;
  totalVolume: number;
  muted: boolean;
  isSeekable?: React.MutableRefObject<boolean>;
  theme?: VolumeTagViewTheme;
  style?: StyleProp<ViewStyle>;
  onVolumeSeekStart?: (
    value: number,
    totalValue: number,
    position: number
  ) => void;
  onVolumeSeekUpdate?: (
    value: number,
    totalValue: number,
    position: number
  ) => void;
  onVolumeSeekEnd?: (
    value: number,
    totalValue: number,
    position: number
  ) => void;
  onVolumePress?: () => void;
};

const VolumeTagView = (props: VolumeTagViewProps) => {
  const {
    volume: playerVolume,
    totalVolume,
    muted,
    isSeekable,
    theme,
    style,
    onVolumeSeekStart,
    onVolumeSeekUpdate,
    onVolumeSeekEnd,
    onVolumePress,
  } = props;

  const [volume, setVolume] = React.useState(0);
  const SEEK_WIDTH = 100;

  const seekBarTheme = React.useMemo((): SeekBarTheme => {
    return {
      trackColor: theme?.barColor,
      totalTrackColor: theme?.underlayColor,
      thumbColor: theme?.thumbColor,
      cachedTrackColor: 'rgba(0,0,0,0)',
      thumbBorderColor: 'rgba(0,0,0,0)',

      thumbBorderWidth: 0,
      thumbBorderCornerRadius: 0,

      trackHeight: theme?.trackHeight,
      thumbSize: theme?.thumbSize,
      thumbCornerRadius: theme?.thumbCornerRadius,
      
    };
  }, [theme]);

  const containerStyle = {
    width: SEEK_WIDTH + (theme?.iconSize! + 20),
  };

  const seekStyle = {
    width: SEEK_WIDTH,
  };

  const onSeekStart = React.useCallback(
    (value: number, totalValue: number, position: number) => {
      setVolume(value);
      onVolumeSeekStart?.(value, totalValue, position);
    },
    []
  );

  const onSeekUpdate = React.useCallback(
    (value: number, totalValue: number, position: number) => {
      setVolume(value);
      onVolumeSeekUpdate?.(value, totalValue, position);
    },
    []
  );

  const onSeekEnd = React.useCallback(
    (value: number, totalValue: number, position: number) => {
      setVolume(value);
      onVolumeSeekEnd?.(value, totalValue, position);
    },
    []
  );

  const onToggleVolume = () => {
    onVolumePress?.();
  };

  React.useEffect(() => {
    setVolume(playerVolume);
  }, [playerVolume])

  return (
    <View style={[styles.container, style, containerStyle]}>
      <SeekBar
        style={[styles.seek, seekStyle]}
        trackValue={volume}
        totalTrackValue={totalVolume}
        disableCachedTrack={true}
        disableThumbBorder={true}
        theme={seekBarTheme}
        isSeekable={isSeekable}
        onSeekStart={onSeekStart}
        onSeekUpdate={onSeekUpdate}
        onSeekEnd={onSeekEnd}
      />
      <IconButton onPress={onToggleVolume}>
        {muted ? (
          <IconVolume size={theme?.iconSize} color={theme?.iconColor} />
        ) : (
          getVolumeIcon(volume, totalVolume, theme?.iconSize, theme?.iconColor)
        )}
      </IconButton>
    </View>
  );
};

export default VolumeTagView;

VolumeTagView.defaultProps = {
  volume: 50,
  totalVolume: 100,
  fullScreen: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seek: {
    paddingVertical: 3,
  },
});
