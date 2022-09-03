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

import { IconLock } from './../../assets/icons';
import { boundPosition } from '../utils/MathUtil';
import { getAlphaColor } from '../utils/ColorUtil';
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
    // height,
    // borderRadius: br,
    // thumbWidth: tw,
    completeThreshold,
    // iconSize,
    disabled,
    // padding,
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
  // let thumbWidth = (theme?.thumbWidth ) - theme?.padding! * 2;
  let borderRadius = (height! / 2);
  let childHeight = theme?.thumbHeight;
  const childRadius = theme?.thumbCornerRadius;

  // console.log(`thumbWidth: ${thumbWidth} childHeight: ${childHeight} childRadius: ${childRadius}`)

  

  const onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimensions;
    if (w !== width || h !== height) {
      setDimensions({ width, height });
      //   slideDistance.current = (width - padding! * 2 - thumbWidth) * rtlMultiplier;
      //   slideThreshold.current = slideDistance.current * (completeThreshold! / 100);
    }
  };

  React.useEffect(() => {
    slideDistance.current =
      (dimensions.width - theme?.padding! * 2 - theme?.thumbWidth!) * rtlMultiplier;
    slideThreshold.current = slideDistance.current * (completeThreshold! / 100);
    console.log(
      `slideDistance: ${slideDistance.current} slideThreshold: ${slideThreshold.current}`
    );
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
    console.log(`handleComplete: ${reached}`);
    if (reached) {
      onReachedToEnd && onReachedToEnd();
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
      onReachedToStart && onReachedToStart();
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
        // console.log(
        //   `SlideButton:panResponder:: handlePanResponderGrant:locationX: ${e.nativeEvent.locationX} pageX: ${e.nativeEvent.pageX} moveX: ${gestureState.moveX} dx: ${gestureState.dx}`,
        // );
        if (gestureDisabled.current) {
          return;
        }
        onSlideStart && onSlideStart();
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (gestureDisabled.current) {
          return;
        }
        // console.log(`panResponder:: handlePanResponderMove:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`);
        if (dx.current != gestureState.dx) {
          // console.log(
          //     `SlideButton:panResponder:: onPanResponderMove:locationX: ${e.nativeEvent.locationX} pageX: ${e.nativeEvent.pageX} moveX: ${gestureState.moveX} dx: ${gestureState.dx}`,
          //   );
          dx.current = gestureState.dx;
          const position = boundPosition(
            locationX.current + dx.current,
            slideDistance.current
          );
          // console.log(`SlideButton:panResponder:: handlePanResponderMove:: position: ${position} contextX:${locationX.current}`);
          thumbPosition.setValue(position);
          underLayWidth.setValue(position * rtlMultiplier + theme?.thumbWidth!);
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        // console.log(
        //   `SlideButton:panResponder:: handlePanResponderRelease:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`,
        // );
        if (gestureDisabled.current) {
          return;
        }
        locationX.current = locationX.current + dx.current;
        onSlideEnd && onSlideEnd();
        // console.log(
        //   `SlideButton:panResponder:: handlePanResponderRelease:: locationX: ${locationX.current} isRTL: ${isRTL}`
        // );
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
        // console.log(
        //   `SlideButton:panResponder:: handlePanResponderTerminate:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`,
        // );
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
  // height: 40,
  // borderRadius: 20,
  padding: 0,
  title: 'Slide to unlock',
  completeThreshold: 60,
  iconSize: 18,
  disabled: false,
  reverseSlideEnabled: true,
  autoReset: false,
  autoResetDelay: 1000,
  // theme: {
  //   containerColor: DefaultTheme.slideButton.containerColor,
  //   underlayColor: DefaultTheme.slideButton.underlayColor,
  //   thumbColor: DefaultTheme.slideButton.thumbColor,
  //   thumbIconColor: DefaultTheme.slideButton.thumbIconColor,
  //   textColor: DefaultTheme.slideButton.textColor,
  // },
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
    // height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    // borderRadius: 20,
    // marginVertical: 10,
    // backgroundColor: Theme.colors.slideButtonContainer,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  underlayContainer: {
    position: 'absolute',
    // backgroundColor: Theme.colors.slideButtonUnderlay,
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
    // color: '#fafafa',
  },
  thumbContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Theme.colors.slideButtonThumb,
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
