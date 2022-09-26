import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { IconPlayCircle } from '../assets/icons';
import { Dimension } from './NexenPlayer';

type PlayButtonProps = {
  dimension?: Dimension;
  onPlayPress?: (event: GestureResponderEvent) => void;
};

const PlayButton = (props: PlayButtonProps) => {
  const { dimension } = props;
  const minValue = Math.min(dimension?.width!, dimension?.height!);
  const ICON_SIZE = minValue * 0.3;
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.6}
      onPress={props.onPlayPress}
    >
      <IconPlayCircle size={ICON_SIZE} color="rgba(255,255,255,0.7)" />
    </TouchableOpacity>
  );
};

export default PlayButton;

PlayButton.defaultProps = {
  dimension: { width: 0, height: 0 },
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
