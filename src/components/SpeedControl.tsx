import React from 'react';
import {
  Animated,
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

const speedData = ['0.25', '0.5', '0.75', '1.0', '1.5', '2.0', '3.0'];

type SpeedControlProps = {
  opacity: Animated.Value;
  marginBottom: Animated.Value;
  style?: StyleProp<ViewStyle>;
  currentSpeed?: number;
  nexenTheme?: NexenTheme;
  // seekBarTheme?: StepSeekBarTheme;
  onSpeedChange?: (speed: string) => void;
};

const SpeedControl = (props: SpeedControlProps) => {
  const {
    opacity,
    marginBottom,
    style,
    currentSpeed,
    nexenTheme,
    onSpeedChange,
  } = props;
  // const floatValue = currentSpeed?.toFixed(1);
  const srtValue = String(currentSpeed);
  const curerntIndex = speedData.indexOf(srtValue!);
  console.log(`curerntIndex: ${curerntIndex} srtValue: ${srtValue} currentSpeed: ${currentSpeed}`);
  const validIndex = curerntIndex < 0 ? 3 : curerntIndex;
  const CONTAINER_BACKGROUND_COLOR = getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.7)
  const CONTAINER_BORDER_RADIUS = nexenTheme?.sizes?.modalCornerRadius
  // const CONTAINER_PADDING = nexenTheme?.sizes?.paddingVertical

  const stepSeekBarTheme = React.useMemo((): StepSeekBarTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      lineColor: nexenTheme?.speedSeekBar?.lineColor
      || getAlphaColor(nexenTheme?.colors?.accentColor!, 0.7),
      dotColor: nexenTheme?.speedSeekBar?.dotColor
      || nexenTheme?.colors?.secondaryColor,
      thumbColor: nexenTheme?.speedSeekBar?.thumbColor
      || nexenTheme?.colors?.secondaryColor,
      textColor: nexenTheme?.speedSeekBar?.textColor
      || nexenTheme?.colors?.secondaryTextColor,

      textSize: nexenTheme?.speedSeekBar?.textSize,
      lineHeight: nexenTheme?.speedSeekBar?.lineHeight,
      dotSize: nexenTheme?.speedSeekBar?.dotSize,
      thumbSize: nexenTheme?.speedSeekBar?.thumbSize,
      dotCornerRadius: nexenTheme?.speedSeekBar?.dotCornerRadius,
      thumbCornerRadius: nexenTheme?.speedSeekBar?.thumbCornerRadius,
    };
  }, [nexenTheme]);

  const CONTAINER_HEIGHT = stepSeekBarTheme.thumbSize! + 12 * 2 + stepSeekBarTheme?.textSize! + nexenTheme?.sizes?.paddingVertical! * 2;
  console.log(`CONTAINER_HEIGHT:: ${CONTAINER_HEIGHT}`)
  const containerStyle = {
    // opacity, 
    // marginBottom, 
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: CONTAINER_BACKGROUND_COLOR,
    borderTopLeftRadius: CONTAINER_BORDER_RADIUS,
    borderTopRightRadius: CONTAINER_BORDER_RADIUS,
  }

  return (
    <ModalView
      style={[
        styles.container,
        style,
        containerStyle,
      ]}
      opacity={opacity}
      marginBottom={marginBottom}
    >
      <>
      <GradientView
        style={{
          height: '100%',
          width: '100%',
        }}
        startOpacity={0.0}
        middleOpacity={0.2}
        endOpacity={0.5}
      />
      <TouchableHighlight style={styles.innerContainer}>
        <StepSeekBar
          data={speedData}
          initialIndex={validIndex}
          theme={stepSeekBarTheme}
          onStepChange={onSpeedChange}
        />
      </TouchableHighlight>
      </>
    </ModalView>
  );
};

export default SpeedControl;

SpeedControl.defaultProps = {
  currentSpeed: 1.0,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 0,
    // minHeight: 50,
    // maxHeight: 100,
    zIndex: 110,
    
    overflow: 'hidden',
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
  },
  innerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    padding: 10,
  },
});
