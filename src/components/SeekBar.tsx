import React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {
  boundPosition,
  seekToTrackValue,
  trackToSeekValue,
} from '../utils/MathUtil';
import { getAlphaColor } from '../utils/ColorUtil';
import type { TrackSeekBarTheme } from '../utils/Theme';

export interface SeekBarTheme extends TrackSeekBarTheme {
  // thumbRadius?: number;
  // thumbBorderRadius?: number;
  // seekBarHeight?: number;
}

type SeekBarProps = {
  trackValue: number;
  totalTrackValue: number;
  cachedTrackValue?: number;
  // thumbSize?: number;
  // thumbBorderWidth?: number;
  // thumbRadius?: number;
  // thumbBorderRadius?: number;
  // seekBarHeight?: number;
  isSeekable?: React.MutableRefObject<boolean>;
  disableCachedTrack?: boolean;
  disableThumbBorder?: boolean;
  theme?: SeekBarTheme;
  style?: StyleProp<ViewStyle>;
  onSeekStart?: (value: number, totalValue: number, position: number) => void;
  onSeekUpdate?: (value: number, totalValue: number, position: number) => void;
  onSeekEnd?: (value: number, totalValue: number, position: number) => void;
};


const SeekBar = (props: SeekBarProps) => {
  // console.log(`Seekbar:: renders`);

  const {
    // thumbSize,
    // thumbBorderWidth,
    // thumbRadius,
    // thumbBorderRadius,
    // seekBarHeight,
    disableCachedTrack,
    disableThumbBorder,
    trackValue,
    cachedTrackValue,
    totalTrackValue,
    theme,
    style,
    onSeekStart,
    onSeekUpdate,
    onSeekEnd,
    isSeekable,
  } = props;

  // console.log(
  //   `SeekbarProps: trackTime: ${trackTime} totalTrackTime: ${totalTrackTime}`,
  // );

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const rtlMultiplier = React.useRef(1);
  const isRTL = I18nManager.isRTL;
  rtlMultiplier.current = isRTL ? -1 : 1;

  const THUMB_BORDER_SIZE = theme?.thumbSize! + theme?.thumbBorderWidth!;
  const PADDING = THUMB_BORDER_SIZE / 2;

  // const thumbBorderRef = React.useRef<View>(null);
  const duration = React.useRef(0);
  const buffer = React.useRef(0);
  const progress = React.useRef(0);

  const seekableDistance = React.useRef(0);
  const locationX = React.useRef(0);
  const dx = React.useRef(0);
  const seekPosition = React.useRef(new Animated.Value(0)).current;
  const seekWidth = React.useRef(new Animated.Value(0)).current;
  const cachedSeekPosition = React.useRef(new Animated.Value(0)).current;
  const cachedSeekWidth = React.useRef(new Animated.Value(0)).current;
  const borderOpacity = React.useRef(new Animated.Value(0)).current;

  const onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimensions;
    if (w !== width || h !== height) {
      setDimensions({ width, height });
    }
  };

  React.useEffect(() => {
    seekableDistance.current =
      (dimensions.width - PADDING * 2) * rtlMultiplier.current;
    // console.log(
    //   `dimensions:: ${JSON.stringify(dimensions)} seekableDistance:: ${
    //     seekableDistance.current
    //   } PADDING: ${PADDING}`,
    // );
  }, [dimensions]);

  React.useEffect(() => {
    duration.current = totalTrackValue;
    buffer.current = cachedTrackValue || 0;
    progress.current = trackValue;
    
    const position = boundPosition(
      trackToSeekValue(progress.current, duration.current, seekableDistance.current),
      seekableDistance.current
    );
    seekPosition.setValue(position);
    seekWidth.setValue(position * rtlMultiplier.current);

    const cachePosition = boundPosition(
      trackToSeekValue(buffer.current, duration.current, seekableDistance.current),
      seekableDistance.current
    );
    cachedSeekPosition.setValue(cachePosition);
    cachedSeekWidth.setValue(cachePosition * rtlMultiplier.current);
    // console.log(`Seekbar:: useEffect: tt:${trackTime} ttt: ${totalTrackTime} ctt:: ${cachedTrackTime}`);
  }, [trackValue, cachedTrackValue, totalTrackValue, dimensions]);

  const updateBorderOpacity = (value: number) => {
    Animated.timing(borderOpacity, {
      toValue: value,
      duration: 125,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      // onStartShouldSetPanResponderCapture: (
      //   e: GestureResponderEvent,
      //   gestureState: PanResponderGestureState,
      // ) => {
      //   if (seekable) return true;
      //   else return false;
      // },
      onMoveShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      // onMoveShouldSetPanResponderCapture: (
      //   e: GestureResponderEvent,
      //   gestureState: PanResponderGestureState,
      // ) => {
      //   if (seekable) return true;
      //   else return false;
      // },
      onPanResponderGrant: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (!isSeekable?.current) return;
        console.log(
          `SeekBar:panResponder:: handlePanResponderGrant:locationX: ${e.nativeEvent.locationX} pageX: ${e.nativeEvent.pageX} dx: ${gestureState.dx}`,
        );
        // console.log(`SeekBar:panResponder: handlePanResponderGrant: trackTime: ${progress.current} totalTrackTime: ${duration.current}`)

        const position = boundPosition(
          isRTL
            ? seekableDistance.current + e.nativeEvent.locationX
            : e.nativeEvent.locationX,
          seekableDistance.current
        );
        // console.log(
        //   `SeekBar:panResponder:: handlePanResponderGrant : position: ${position}`,
        // );
        seekPosition.setValue(position);
        seekWidth.setValue(position * rtlMultiplier.current);
        if (!disableThumbBorder) {
          updateBorderOpacity(1);
        }
        locationX.current = position;
        dx.current = gestureState.dx;
          onSeekStart?.(
            seekToTrackValue(
              position,
              duration.current,
              seekableDistance.current
            ),
            duration.current,
            position
          );
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (!isSeekable?.current) return;
        if (dx.current != gestureState.dx) {
          dx.current = gestureState.dx;
          const position = boundPosition(
            locationX.current + dx.current,
            seekableDistance.current
          );
          seekPosition.setValue(position);
          seekWidth.setValue(position * rtlMultiplier.current);
          // locationX.current = position;
          // console.log(
          //   `SeekBar:panResponder:: handlePanResponderMove:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx} position: ${position}`,
          // );
            onSeekUpdate?.(
              seekToTrackValue(
                position,
                duration.current,
                seekableDistance.current
              ),
              duration.current,
              position
            );
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (!isSeekable?.current) return;
        // console.log(
        //   `SeekBar:panResponder:: handlePanResponderRelease:: locationX: ${locationX.current} dx: ${dx.current}`,
        // );

        if (!disableThumbBorder) {
          updateBorderOpacity(0);
        }
        const position = boundPosition(
          locationX.current + dx.current,
          seekableDistance.current
        );
        // locationX.current = locationX.current + dx.current;
        
          onSeekEnd?.(
            seekToTrackValue(
              position,
              duration.current,
              seekableDistance.current
            ),
            duration.current,
            position
          );
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
        //   `SeekBar:panResponder:: handlePanResponderTerminate:: locationX: ${e.nativeEvent.locationX} dx: ${gestureState.dx}`,
        // );
      },
    })
  );

  const thumbContainerStyle = {
    width: THUMB_BORDER_SIZE,
    height: THUMB_BORDER_SIZE,
    transform: [{ translateX: seekPosition }]
  }

  const thumbStyle = {
    height: theme?.thumbSize,
    width: theme?.thumbSize,
    borderRadius: theme?.thumbCornerRadius,
    backgroundColor: theme?.thumbColor,
  };

  const thumbBorderStyle = {
    width: THUMB_BORDER_SIZE,
    height: THUMB_BORDER_SIZE,
    borderRadius: theme?.thumbBorderCornerRadius,
    backgroundColor: theme?.thumbBorderColor,
    opacity: borderOpacity,
  };

  const totalSeekBarStyle = {
    left: PADDING,
    right: PADDING,
    backgroundColor: theme?.totalTrackColor,
    height: theme?.trackHeight,
    borderRadius: theme?.trackHeight! / 2,
  };

  const seekBarStyle = {
    left: PADDING,
    backgroundColor: theme?.trackColor,
    width: seekWidth,
    height: theme?.trackHeight,
    borderRadius: theme?.trackHeight! / 2,
  };

  const cachedBarStyle = {
    left: PADDING,
    backgroundColor: theme?.cachedTrackColor,
    width: cachedSeekWidth,
    height: theme?.trackHeight,
    borderRadius: theme?.trackHeight! / 2,
  };

  return (
    <View
      style={[styles.container, style]}
      onLayout={onLayoutChange}
      {...panResponder.current.panHandlers}
    >
      {/* Duration Bar */}
      <View
        style={[styles.totalSeekBar, totalSeekBarStyle]}
      />
      {/* Progress Bar*/}
      <Animated.View
        style={[styles.seekBar, seekBarStyle]}
        // pointerEvents="none"
      />
      {/* Cache Bar*/}
      {!disableCachedTrack && (
        <Animated.View
          style={[styles.cachedBar, cachedBarStyle]}
          // pointerEvents="none"
        />
      )}
      {/* Seek Bar Thumb */}
      <Animated.View
        style={[
          styles.thumbContainer,
          thumbContainerStyle,
        ]}
        pointerEvents="none"
      >
        {!disableThumbBorder && (
          <Animated.View
          // ref={thumbBorderRef}
          style={[styles.thumbBorder, thumbBorderStyle]}
        />
        )}
        <View style={[thumbStyle]} />
      </Animated.View>
    </View>
  );
};

export default SeekBar;

SeekBar.defaultProps = {
  disableCachedTrack: false,
  disableThumbBorder: false,
  thumbSize: 10,
  thumbBorderWidth: 5,
  thumbRadius: 5,
  thumbBorderRadius: 7.5,
  seekBarHeight: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  thumbContainer: {
    zIndex: 40,
    alignSelf: 'baseline',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbBorder: {
    position: 'absolute',
    backgroundColor: 'rgba(250,250,250,0.7)'
  },
  totalSeekBar: {
    zIndex: 10,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    backgroundColor: 'rgba(250,250,250,0.3)'
  },
  seekBar: {
    zIndex: 30,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    backgroundColor: '#fa5005'
  },
  cachedBar: {
    zIndex: 20,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    backgroundColor: '#fafafa'
  },
});
