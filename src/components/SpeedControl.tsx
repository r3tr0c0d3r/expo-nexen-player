import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import type { NexenTheme } from '../utils/Theme';
import { getAlphaColor } from '../utils/ColorUtil';

import GradientView from './GradientView';
import StepSeekBar, { StepSeekBarTheme } from './StepSeekBar';
import ModalView from './ModalView';
import { withAnimation } from '../hoc/withAnimation';
import { EdgeInsets, PlaybackSpeed } from './NexenPlayer';

const speedData = ['0.25', '0.5', '0.75', '1.0', '1.5', '2.0', '3.0'];

type SpeedControlProps = {
  style?: StyleProp<ViewStyle>;
  currentSpeed?: PlaybackSpeed;
  fullScreen: boolean;
  nexenTheme?: NexenTheme;
  insets?: EdgeInsets;
  onSpeedChange?: (speed: string) => void;
};

const SpeedControl = (props: SpeedControlProps) => {
  const { style, currentSpeed, fullScreen, nexenTheme, insets, onSpeedChange } =
    props;

  const curerntIndex = speedData.indexOf(currentSpeed!);
  const validIndex = curerntIndex < 0 ? 3 : curerntIndex;

  const CONTAINER_HORIZONTAL_PADDING = fullScreen
    ? (insets?.left! + insets?.right!) / 2 > 0
      ? (insets?.left! + insets?.right!) / 2
      : 8
    : 8;

  const stepSeekBarTheme = React.useMemo((): StepSeekBarTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      lineColor:
        nexenTheme?.speedSeekBar?.lineColor ||
        getAlphaColor(nexenTheme?.colors?.accentColor!, 0.7),
      dotColor:
        nexenTheme?.speedSeekBar?.dotColor ||
        nexenTheme?.colors?.secondaryColor,
      thumbColor:
        nexenTheme?.speedSeekBar?.thumbColor ||
        nexenTheme?.colors?.secondaryColor,
      textColor:
        nexenTheme?.speedSeekBar?.textColor ||
        nexenTheme?.colors?.secondaryTextColor,

      textSize: nexenTheme?.speedSeekBar?.textSize,
      lineHeight: nexenTheme?.speedSeekBar?.lineHeight,
      dotSize: nexenTheme?.speedSeekBar?.dotSize,
      thumbSize: nexenTheme?.speedSeekBar?.thumbSize,
      dotCornerRadius: nexenTheme?.speedSeekBar?.dotCornerRadius,
      thumbCornerRadius: nexenTheme?.speedSeekBar?.thumbCornerRadius,
    };
  }, [nexenTheme]);

  const SEEK_BAR_HEIGHT =
    stepSeekBarTheme.thumbSize! + 12 * 2 + stepSeekBarTheme?.textSize!;

  const containerStyle = {
    left: CONTAINER_HORIZONTAL_PADDING,
    right: CONTAINER_HORIZONTAL_PADDING,
    bottom: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  };

  const stepSeekBarStyle = {
    height: SEEK_BAR_HEIGHT,
  };

  return (
    <ModalView style={[styles.container, style, containerStyle]}>
      <GradientView
        style={{
          height: '100%',
          width: '100%',
        }}
        startOpacity={0.0}
        middleOpacity={0.2}
        endOpacity={0.5}
      />
      <TouchableHighlight style={[styles.innerContainer]}>
        <StepSeekBar
          style={stepSeekBarStyle}
          data={speedData}
          initialIndex={validIndex}
          theme={stepSeekBarTheme}
          onStepChange={onSpeedChange}
        />
      </TouchableHighlight>
    </ModalView>
  );
};

export default withAnimation(SpeedControl);

SpeedControl.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    maxHeight: 120,
    zIndex: 110,
    overflow: 'hidden',
  },
  innerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
  },
});
