import React from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  View,
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
  onStepChange?: (value: string) => void;
};

// const HORIZONTAL_PADDING = 7;

const StepSeekBar = (props: StepSeekBarProps) => {
  const { data, initialIndex, theme, onStepChange } = props;
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  // const [moving, setMoving] = React.useState(false);

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
      console.log(`width: ${width} height: ${height}`);
    }
  };

  React.useEffect(() => {
    seekDistance.current =
      (dimensions.width - theme?.thumbSize!) * rtlMultiplier.current;

    stepWidth.current = seekDistance.current / (data.length - 1);
    stepThreshold.current = stepWidth.current / 2;
    console.log(
      `slideDistance: ${seekDistance.current} stepThreshold: ${stepThreshold.current} stepWidth:: ${stepWidth.current}`
    );
    calculateInitialStep();
  }, [dimensions]);

  const calculateInitialStep = () => {
    const currentPosition = (stepWidth.current * initialIndex!);// + (theme?.thumbSize! / 2);
    locationX.current = currentPosition;
    cursorPosition.setValue(currentPosition);
    console.log(`initialIndex: ${initialIndex} currentPosition: ${currentPosition}`);
  };

  const moveTo = (position: number, callback?: () => void) => {
    console.log(`moveTo:: value: ${position}`);
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
    console.log(`jumpTo:: ${position}`);
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
    const value = data[index];
    onStepChange?.(value);
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
        // console.log(
        //   `StepSlider:panResponder:: onPanResponderGrant:: locationX: ${locationX.current} isMoving: ${isMoving.current}`,
        // );
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        // console.log(`panResponder:: handlePanResponderMove:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`);
        if (dx.current != gestureState.dx) {
          dx.current = gestureState.dx;
          // console.log(
          //     `StepSlider:panResponder:: onPanResponderMove: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx} isMoving: ${isMoving.current}`,
          //   );

          if (isMoving.current) {
            const position = boundPosition(
              locationX.current + dx.current,
              seekDistance.current
            );
            cursorPosition.setValue(position);
            // console.log(`position: ${position}`)
          } else {
            if (Math.abs(dx.current) > 20) {
              if (animFinished.current) {
                animFinished.current = false;
                dx.current = gestureState.dx;
                const position = boundPosition(
                  locationX.current + dx.current,
                  seekDistance.current
                );
                // cursorPosition.setValue(position);
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
        // console.log(
        //   `StepSlider:panResponder:: handlePanResponderRelease:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`,
        // );
        // console.log(
        //   `StepSlider:panResponder:: handlePanResponderRelease:: locationX: ${locationX.current} dx: ${dx.current}`,
        // );
        isMoving.current = false;
        const position = boundPosition(
          locationX.current + dx.current,
          seekDistance.current
        );
        locationX.current = position;

        const index = Math.floor(locationX.current / stepWidth.current);
        const remainder = locationX.current % stepWidth.current;
        // console.log(`index: ${index} remainder: ${remainder}`);
        if (Math.abs(remainder) >= Math.abs(stepThreshold.current)) {
          const nextPosition = stepWidth.current * (index + 1);
          locationX.current = nextPosition;
          moveTo(nextPosition, () => {
            handleComplete(index + 1);
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
        // console.log(
        //   `StepSlider:panResponder:: handlePanResponderTerminate:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`,
        // );
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
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
    <View style={styles.container} onLayout={onLayoutChange}>
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
    flex: 1,
    justifyContent: 'center',
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
    // position: 'absolute',
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
