import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';

import { IconLock } from '../assets/icons';
import { boundPosition } from '../utils/MathUtil';
import type { LockButtonTheme } from '../utils/Theme';

export interface SlideButtonTheme extends LockButtonTheme {
  padding?: number;
  font?: string;
}

type SlideButtonProps = {
  title?: string;
  width?: number;
  disabled?: boolean;
  completeThreshold?: number;
  reverseSlideEnabled?: boolean;
  autoReset?: boolean;
  autoResetDelay?: number;
  theme?: SlideButtonTheme;
  onSlideStart?: () => void;
  onSlideEnd?: () => void;
  onReachedToStart?: () => void;
  onReachedToEnd?: () => void;
};

const SlideButton = (props: SlideButtonProps) => {
  const {
    title,
    width,
    completeThreshold,
    disabled,
    reverseSlideEnabled,
    autoReset,
    autoResetDelay,
    theme,
    onSlideStart,
    onSlideEnd,
    onReachedToStart,
    onReachedToEnd,
  } = props;
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const thumbPosition = React.useRef(new Animated.Value(0)).current;
  const underLayWidth = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef<Animated.AnimatedInterpolation>();
  const slideDistance = React.useRef(0);
  const slideThreshold = React.useRef(0);
  const gestureDisabled = React.useRef(disabled);
  const locationX = React.useRef(0);
  const dx = React.useRef(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>();

  const isRTL = I18nManager.isRTL;
  const rtlMultiplier = isRTL ? -1 : 1;
  let height = theme?.thumbWidth! + theme?.padding! * 2;
  let borderRadius = (height! / 2);
  let childHeight = theme?.thumbHeight;
  const childRadius = theme?.thumbCornerRadius;

  const onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimensions;
    if (w !== width || h !== height) {
      setDimensions({ width, height });
    }
  };

  React.useEffect(() => {
    slideDistance.current =
      (dimensions.width - theme?.padding! * 2 - theme?.thumbWidth!) * rtlMultiplier;
    slideThreshold.current = slideDistance.current * (completeThreshold! / 100);
  }, [dimensions]);

  React.useEffect(() => {
    gestureDisabled.current = disabled;
  }, [disabled]);

  React.useEffect(() => {
    textOpacity.current = thumbPosition.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });
  }, [thumbPosition]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const moveTo = (value: number, complete: boolean) => {
    Animated.parallel([
      Animated.timing(thumbPosition, {
        toValue: value,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(underLayWidth, {
        toValue: value * rtlMultiplier + theme?.thumbWidth!,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        handleComplete(complete);
      }
    });
  };

  const reset = () => {
    moveTo(0, false);
    gestureDisabled.current = false;
  };

  const handleComplete = (reached: boolean) => {
    if (reached) {
      onReachedToEnd?.();
      if (autoReset) {
        gestureDisabled.current = true;
        timeoutRef.current = setTimeout(() => {
          reset();
        }, autoResetDelay);
      }
      if (!reverseSlideEnabled) {
        gestureDisabled.current = true;
      }
    } else {
      onReachedToStart?.();
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onMoveShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        return true;
      },
      onPanResponderGrant: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureDisabled.current) {
          return;
        }
        onSlideStart?.();
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureDisabled.current) {
          return;
        }

        if (dx.current != gestureState.dx) {
          dx.current = gestureState.dx;
          const position = boundPosition(
            locationX.current + dx.current,
            slideDistance.current
          );
          thumbPosition.setValue(position);
          underLayWidth.setValue(position * rtlMultiplier + theme?.thumbWidth!);
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureDisabled.current) {
          return;
        }
        locationX.current = locationX.current + dx.current;
         onSlideEnd?.();

        if (isRTL) {
          if (locationX.current > slideThreshold.current) {
            if (locationX.current === 0) {
              handleComplete(false);
              return;
            }
            moveTo(0, false);
            locationX.current = 0;
          } else {
            if (locationX.current === slideDistance.current) {
              handleComplete(true);
              return;
            }
            moveTo(slideDistance.current, true);
            locationX.current = slideDistance.current;
          }
        } else {
          if (locationX.current < slideThreshold.current) {
            if (locationX.current === 0) {
              handleComplete(false);
              return;
            }
            moveTo(0, false);
            locationX.current = 0;
          } else {
            if (locationX.current === slideDistance.current) {
              handleComplete(true);
              return;
            }
            moveTo(slideDistance.current, true);
            locationX.current = slideDistance.current;
          }
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
    })
  );

  const containerStyle = {
    width,
    height: height, 
    borderRadius,
    backgroundColor: theme?.containerColor,
  }
  const titleContainerStyle = {
    height: childHeight,
    margin: theme?.padding!,
    borderRadius: childRadius,
  };

  const titleStyle = {
    color: theme?.textColor,
    opacity: textOpacity.current,
    fontFamily: theme?.font,
  }

  const underlayStyle = {
    left: theme?.padding!!,
    width: underLayWidth, 
    height: childHeight,
    borderRadius: childRadius,
    backgroundColor: theme?.underlayColor,
  };

  const thumbStyle = {
    left: theme?.padding!,
    width: theme?.thumbWidth,
    height: childHeight,
    borderRadius: childRadius,
    backgroundColor: theme?.thumbColor,
    transform: [{ translateX: thumbPosition }],
  };

  const iconContainerStyle = {
    width: childHeight,
    height: childHeight,
    borderRadius: childRadius,
    transform: [{ scaleX: isRTL ? -1 : 1 }],
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
      onLayout={onLayoutChange}
    >
      {/* button title */}
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <Animated.Text
          numberOfLines={2}
          allowFontScaling={false}
          style={[
            styles.title,
            titleStyle,
          ]}>
          {title}
        </Animated.Text>
      </View>
      {/* underlay */}
      <Animated.View
        style={[
          styles.underlayContainer,
          underlayStyle,
        ]}
      />
      {/* button thumb */}
      <Animated.View
        style={[
          styles.thumbContainer,
          thumbStyle,
        ]}
        {...panResponder.current.panHandlers}
      >
        <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
          <IconLock size={theme?.thumbIconSize} color={theme?.thumbIconColor} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default SlideButton;

SlideButton.defaultProps = {
  width: '100%',
  padding: 0,
  title: 'Slide to unlock',
  completeThreshold: 60,
  iconSize: 18,
  disabled: false,
  reverseSlideEnabled: true,
  autoReset: false,
  autoResetDelay: 1000,

  onSlideStart: () => {},
  onSlideEnd: () => {},
  onReachedToStart: () => {},
  onReachedToEnd: () => {},
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 140,
    maxWidth: 220,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  underlayContainer: {
    position: 'absolute',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    maxWidth: '60%',
    textAlign: 'center',
  },
  thumbContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
