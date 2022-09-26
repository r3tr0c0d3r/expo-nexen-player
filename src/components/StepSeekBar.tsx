import React from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { boundPosition } from '../utils/MathUtil';
import type { SpeedSeekBarTheme } from '../utils/Theme';


export interface StepSeekBarTheme extends SpeedSeekBarTheme {
  font?: string;
}
type StepSeekBarProps = {
  initialIndex?: number;
  data: string[];
  theme?: StepSeekBarTheme;
  style?: StyleProp<ViewStyle>;
  onStepChange?: (value: string) => void;
};

const StepSeekBar = (props: StepSeekBarProps) => {
  const { data, initialIndex, theme, style, onStepChange } = props;
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const cursorPosition = React.useRef(new Animated.Value(0)).current;
  const locationX = React.useRef(0);
  const dx = React.useRef(0);
  const isMoving = React.useRef(false);
  const animFinished = React.useRef(true);

  const seekDistance = React.useRef(0);
  const stepThreshold = React.useRef(0);
  const stepWidth = React.useRef(0);

  const rtlMultiplier = React.useRef(1);
  const isRTL = I18nManager.isRTL;
  rtlMultiplier.current = isRTL ? -1 : 1;

  const HORIZONTAL_PADDING = theme?.thumbSize! / 2;

  const onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimensions;
    if (w !== width || h !== height) {
      setDimensions({ width, height });
    }
  };

  React.useEffect(() => {
    seekDistance.current = (dimensions.width - theme?.thumbSize!) * rtlMultiplier.current;
    stepWidth.current = seekDistance.current / (data.length - 1);
    stepThreshold.current = stepWidth.current / 2;
    calculateInitialStep();
  }, [dimensions]);

  const calculateInitialStep = () => {
    const currentPosition = (stepWidth.current * initialIndex!);
    locationX.current = currentPosition;
    cursorPosition.setValue(currentPosition);
  };

  const moveTo = (position: number, callback?: () => void) => {
    Animated.timing(cursorPosition, {
      toValue: position,
      duration: 200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        callback?.();
      }
    });
  };

  const jumpTo = (position: number, callback?: () => void) => {
    Animated.timing(cursorPosition, {
      toValue: position,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      callback?.();
    });
  };

  const handleComplete = (index: number) => {
    if (index >= 0 && index < data.length) {
      const value = data[index];
      onStepChange?.(value);
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onStartShouldSetPanResponderCapture: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onMoveShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onMoveShouldSetPanResponderCapture: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onPanResponderGrant: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (dx.current != gestureState.dx) {
          dx.current = gestureState.dx;

          if (isMoving.current) {
            const position = boundPosition(
              locationX.current + dx.current,
              seekDistance.current
            );
            cursorPosition.setValue(position);
          } else {
            if (Math.abs(dx.current) > 20) {
              if (animFinished.current) {
                animFinished.current = false;
                dx.current = gestureState.dx;
                const position = boundPosition(
                  locationX.current + dx.current,
                  seekDistance.current
                );
                jumpTo(position, () => {
                  isMoving.current = true;
                  animFinished.current = true;
                });
              }
            }
          }
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        isMoving.current = false;
        const position = boundPosition(
          locationX.current + dx.current,
          seekDistance.current
        );
        locationX.current = position;

        const index = Math.floor(locationX.current / stepWidth.current);
        const remainder = locationX.current % stepWidth.current;
        if (Math.abs(remainder) >= Math.abs(stepThreshold.current)) {
          let nextIndex = index + 1;
          let nextPosition = stepWidth.current * (nextIndex);
          if (nextPosition > seekDistance.current) {
            nextIndex = index;
            nextPosition = stepWidth.current * (nextIndex);
          }
          locationX.current = nextPosition;
          moveTo(nextPosition, () => {
            handleComplete(nextIndex);
          });
        } else {
          const nextPosition = stepWidth.current * index;
          locationX.current = nextPosition;
          moveTo(nextPosition, () => {
            handleComplete(index);
          });
        }
      },
      onPanResponderTerminationRequest: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => false,
      onPanResponderTerminate: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {

      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    })
  );

  const lineStyle = { 
    backgroundColor: theme?.lineColor,
    height: theme?.lineHeight,
    left: HORIZONTAL_PADDING,
    right: HORIZONTAL_PADDING,
   }

   const dotStyle = { 
    backgroundColor: theme?.dotColor,
    width: theme?.dotSize,
    height: theme?.dotSize,
    borderRadius: theme?.dotCornerRadius,
   }

   const cursorStyle = {
    backgroundColor: theme?.thumbColor,
    width: theme?.thumbSize,
    height: theme?.thumbSize,
    borderRadius: theme?.thumbCornerRadius,
    transform: [{ translateX: cursorPosition }],
  }

  const textStyle = {
    color: theme?.textColor,
    fontFamily: theme?.font,
  }

  return (
    <View style={[styles.container, style]} onLayout={onLayoutChange}>
      <View style={styles.slideContainer}>
        <View style={[styles.line, lineStyle]} />
        <View style={[styles.dotContainer, {left: HORIZONTAL_PADDING, right: HORIZONTAL_PADDING}]}>
          {data.map((d, i) => (
            <View
              key={i}
              style={[styles.dot, dotStyle]}
            />
          ))}
        </View>
        <Animated.View
          style={[
            styles.cursor,
            cursorStyle,
          ]}
          {...panResponder.current.panHandlers}
        />
      </View>

      <View style={[styles.textContainer, { paddingHorizontal: HORIZONTAL_PADDING / 2 } ]}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.text, textStyle]}>
            {data[i]}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default StepSeekBar;

StepSeekBar.defaultProps = {
  initialIndex: 0,
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    height: 50,
  },
  slideContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  dotContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  textContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  text: {
    minWidth: 24,
    fontSize: 12,
    textAlign: 'center',
  },
  line: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
  },
  cursor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
