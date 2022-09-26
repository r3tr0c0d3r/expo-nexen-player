import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RippleView, { RippleViewRef } from './RippleView';
import {
  IconFastForward,
  IconRewind,
  IconSun,
  IconVolume2,
} from '../assets/icons';
import SeekBarTipView, {
  SeekBarTipViewRef,
  SeekBarTipViewTheme,
} from './SeekBarTipView';
import TipView, { TipViewRef, TipViewTheme } from './TipView';
import ErrorView, { ErrorViewTheme } from './ErrorView';
import {
  clamp,
  originalToSeekValue,
  seekToOriginalValue,
} from '../utils/MathUtil';
import {
  getForOrRewTimeTipText,
  getForwardOrRewindTimeTipText,
} from '../utils/StringUtil';
import { getAlphaColor } from '../utils/ColorUtil';
import { getBrightnessIcon, getVolumeIcon } from '../utils/ComponentUtil';
import type { Dimension, NexenConfig } from './NexenPlayer';
import type { NexenTheme } from '../utils/Theme';

const FORWARD_OR_REWIND_DURATION = 10;
const BAR_HEIGHT_PERCENTAGE = 0.35;
export const MAX_VOLUME = 100;
export const MAX_BRIGHTNESS = 100;

export enum GestureEventType {
  TRACK = 'TRACK',
  VOLUME = 'VOLUME',
  BRIGHTNESS = 'BRIGHTNESS',
}

export enum TapEventType {
  SINGLE_TAP = 'SINGLE_TAP',
  DOUBLE_TAP = 'DOUBLE_TAP',
  DOUBLE_TAP_LEFT = 'DOUBLE_TAP_LEFT',
  DOUBLE_TAP_RIGHT = 'DOUBLE_TAP_RIGHT',
  DOUBLE_TAP_MIDDLE = 'DOUBLE_TAP_MIDDLE',
}

type GestureViewProps = {
  style?: StyleProp<ViewStyle>;
  fullScreen: boolean;
  locked: boolean;
  error?: boolean;
  isSeeking: React.MutableRefObject<boolean>;
  isSliding: React.MutableRefObject<boolean>;
  isSeekable: React.MutableRefObject<boolean>;
  gestureEnabled: React.MutableRefObject<boolean>;
  durationTime: React.MutableRefObject<number>;
  currentTime: React.MutableRefObject<number>;
  playerConfig?: NexenConfig;
  dimension: Dimension;
  nexenTheme?: NexenTheme;
  onTapDetected?: (event: TapEventType, value?: number) => void;
  onGestureStart?: (event: GestureEventType, value: number) => void;
  onGestureMove?: (event: GestureEventType, value: number) => void;
  onGestureEnd?: (event: GestureEventType, value: number) => void;
};

const GestureView = (props: GestureViewProps) => {
  const {
    style,
    fullScreen,
    locked,
    error,
    isSeeking,
    isSliding,
    isSeekable,
    gestureEnabled,
    dimension,
    currentTime,
    durationTime,
    playerConfig,
    nexenTheme,
    onTapDetected,
    onGestureMove,
    onGestureEnd,
  } = props;

  const tapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const volumeBarHeight = React.useRef(new Animated.Value(70)).current;
  const brightnessBarHeight = React.useRef(new Animated.Value(0)).current;

  const seekVolume = React.useRef(0);
  const seekVolumeDy = React.useRef(0);
  const seekBrightness = React.useRef(0);
  const seekBrightnessDy = React.useRef(0);
  const locationX = React.useRef(0);
  const locationY = React.useRef(0);
  const dx = React.useRef(0);
  const dy = React.useRef(0);
  const storeDx = React.useRef<number[]>([]);
  const storeDy = React.useRef<number[]>([]);

  const layoutSize = React.useRef({ width: 0, height: 0 });
  const leftBound = React.useRef(0);
  const rightBound = React.useRef(0);
  const trackFactor = React.useRef(1);
  const volumeFactor = React.useRef(1);
  const brightnessFactor = React.useRef(1);

  const activeGesture = React.useRef('');

  const tipViewRef = React.useRef<TipViewRef>(null);
  const leftRippleViewRef = React.useRef<RippleViewRef>(null);
  const rightRippleViewRef = React.useRef<RippleViewRef>(null);
  const volumeTipViewRef = React.useRef<SeekBarTipViewRef>(null);
  const brightnessTipViewRef = React.useRef<SeekBarTipViewRef>(null);

  const minTime = React.useRef(0);
  const maxTime = React.useRef(0);
  const symbol = React.useRef('');
  const layoutOption = React.useRef(playerConfig?.layoutMode);

  const RIPPLE_ICON_SIZE = nexenTheme?.sizes?.rippleIconSize;
  const RIPPLE_ICON_COLOR = nexenTheme?.colors?.rippleIconColor;

  const CONTAINER_BACKGROUND_COLOR =
    nexenTheme?.colors?.modalBackgroundColor ||
    getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.7);
  const CONTAINER_BORDER_RADIUS = nexenTheme?.sizes?.modalCornerRadius;

  const rtlMultiplier = React.useRef(1);
  const isRTL = I18nManager.isRTL;
  rtlMultiplier.current = isRTL ? -1 : 1;

  const volumeBarTheme = React.useMemo((): SeekBarTipViewTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      barColor:
        nexenTheme?.volumeSeekBar?.barColor ||
        getAlphaColor(nexenTheme?.colors?.secondaryColor!, 0.8),
      underlayColor:
        nexenTheme?.volumeSeekBar?.underlayColor ||
        getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.3),
      textColor:
        nexenTheme?.tagView?.textColor ||
        nexenTheme?.colors?.secondaryTextColor,
      textSize:
        nexenTheme?.tagView?.textSize || nexenTheme?.sizes?.secondaryTextSize,
      iconSize: nexenTheme?.sizes?.secondaryIconSize,
      iconColor:
        nexenTheme?.tagView?.iconColor ||
        nexenTheme?.colors?.secondaryIconColor,
    };
  }, [nexenTheme, fullScreen]);

  const brightnessBarTheme = React.useMemo((): SeekBarTipViewTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      barColor:
        nexenTheme?.volumeSeekBar?.barColor ||
        getAlphaColor(nexenTheme?.colors?.secondaryColor!, 0.8),
      underlayColor:
        nexenTheme?.volumeSeekBar?.underlayColor ||
        getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.3),
      textColor:
        nexenTheme?.tagView?.textColor ||
        nexenTheme?.colors?.secondaryTextColor,
      textSize:
        nexenTheme?.tagView?.textSize || nexenTheme?.sizes?.secondaryTextSize,
      iconSize:
        nexenTheme?.tagView?.iconSize || nexenTheme?.sizes?.secondaryIconSize,
      iconColor:
        nexenTheme?.tagView?.iconColor ||
        nexenTheme?.colors?.secondaryIconColor,
    };
  }, [nexenTheme, fullScreen]);

  const tipViewTheme = React.useMemo((): TipViewTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      textColor:
        nexenTheme?.tipView?.textColor ||
        nexenTheme?.colors?.secondaryTextColor,
      textSize:
        nexenTheme?.tipView?.textSize || nexenTheme?.sizes?.secondaryTextSize,
    };
  }, [nexenTheme, fullScreen]);

  const errorTheme = React.useMemo((): ErrorViewTheme => {
    return {
      font: nexenTheme?.fonts?.secondaryFont,
      iconSize: 40,
      iconColor:
        nexenTheme?.tipView?.iconColor ||
        nexenTheme?.colors?.secondaryIconColor,
      textColor:
        nexenTheme?.tipView?.textColor ||
        nexenTheme?.colors?.secondaryTextColor,
      textSize: 16,
    };
  }, [nexenTheme]);

  React.useEffect(() => {
    layoutOption.current = playerConfig?.layoutMode;
  }, [playerConfig]);

  React.useEffect(() => {
    const { width, height } = dimension;
    layoutSize.current = { width, height };
    leftBound.current = (width * rtlMultiplier.current) / 4;
    rightBound.current = width * rtlMultiplier.current - leftBound.current;
    trackFactor.current = width / 60;
    volumeFactor.current = height / (height * BAR_HEIGHT_PERCENTAGE);
    brightnessFactor.current = height / (height * BAR_HEIGHT_PERCENTAGE);

    seekVolume.current = clamp(
      originalToSeekValue(
        playerConfig?.volume!,
        MAX_VOLUME,
        height * BAR_HEIGHT_PERCENTAGE
      ),
      0,
      height * BAR_HEIGHT_PERCENTAGE
    );

    volumeTipViewRef.current?.updateState({
      tipText: `${playerConfig?.volume}%`,
      icon: getVolumeIcon(
        playerConfig?.volume!,
        MAX_VOLUME,
        volumeBarTheme.iconSize,
        volumeBarTheme.iconColor
      ),
    });
    volumeBarHeight.setValue(seekVolume.current);

    seekBrightness.current = clamp(
      originalToSeekValue(
        playerConfig?.brightness!,
        MAX_BRIGHTNESS,
        height * BAR_HEIGHT_PERCENTAGE
      ) + seekBrightnessDy.current,
      0,
      height * BAR_HEIGHT_PERCENTAGE
    );

    brightnessTipViewRef.current?.updateState({
      tipText: `${playerConfig?.brightness}%`,
      icon: getBrightnessIcon(
        playerConfig?.brightness!,
        MAX_BRIGHTNESS,
        brightnessBarTheme.iconSize,
        brightnessBarTheme.iconColor
      ),
    });
    brightnessBarHeight.setValue(seekBrightness.current);
  }, [playerConfig, dimension]);

  React.useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const calculateMinMaxTime = (
    forwardOrRewindTime: number,
    time: number,
    totalTime: number
  ) => {
    if (forwardOrRewindTime >= 0) {
      symbol.current = '+';
      if (forwardOrRewindTime + time >= totalTime) {
        maxTime.current = totalTime;
        minTime.current = totalTime - time;
      } else {
        maxTime.current = forwardOrRewindTime + time;
        minTime.current = forwardOrRewindTime;
      }
    } else {
      symbol.current = '-';
      if (forwardOrRewindTime + time >= 0) {
        maxTime.current = time + forwardOrRewindTime;
        minTime.current = forwardOrRewindTime;
      } else {
        maxTime.current = 0;
        minTime.current = -time;
      }
    }
  };

  const handleDoubleTapForward = () => {
    const time = currentTime.current + FORWARD_OR_REWIND_DURATION;
    rightRippleViewRef.current?.onPress(
      getForOrRewTimeTipText('+', FORWARD_OR_REWIND_DURATION, time)
    );
    onTapDetected?.(TapEventType.DOUBLE_TAP_RIGHT, time);
  };

  const handleDoubleTapRewind = () => {
    const time = currentTime.current - FORWARD_OR_REWIND_DURATION;
    leftRippleViewRef.current?.onPress(
      getForOrRewTimeTipText('-', FORWARD_OR_REWIND_DURATION, time)
    );
    onTapDetected?.(TapEventType.DOUBLE_TAP_LEFT, time);
  };

  const onScreenTouch = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
      if (
        !gestureEnabled.current ||
        layoutOption?.current === 'basic' ||
        locked
      )
        return;
      onTapDetected?.(TapEventType.DOUBLE_TAP);

      if (locationX * rtlMultiplier.current < leftBound.current) {
        handleDoubleTapRewind();
      } else if (locationX * rtlMultiplier.current > rightBound.current) {
        handleDoubleTapForward();
      } else {
        onTapDetected?.(TapEventType.DOUBLE_TAP_MIDDLE);
      }
      // if (showControl) {
      //   if (controlHideOption && controlHideOption == 'auto') {
      //     resetControlTimeout();
      //   }
      // }
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        onTapDetected?.(TapEventType.SINGLE_TAP);
        tapTimeoutRef.current = null;
      }, playerConfig?.doubleTapTime);
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
      ) => false,
      onMoveShouldSetPanResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (isSeeking.current || isSliding.current) {
          return false;
        }
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
      },
      onMoveShouldSetPanResponderCapture: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (isSeeking.current || isSliding.current) {
          return false;
        }
        return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
        // return  || ;
      },
      onPanResponderGrant: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (
          !gestureEnabled.current ||
          !isSeekable.current ||
          layoutOption?.current !== 'advanced'
        )
          return;
        locationX.current = e.nativeEvent.locationX;
        locationY.current = e.nativeEvent.locationY;
      },
      onPanResponderMove: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (
          !gestureEnabled.current ||
          !isSeekable.current ||
          layoutOption?.current !== 'advanced'
        )
          return;

        if (dx.current !== gestureState.dx || dy.current !== gestureState.dy) {
          dx.current = gestureState.dx;
          dy.current = gestureState.dy;
          if (storeDx.current.length < 5) {
            storeDx.current.push(gestureState.dx);
            storeDy.current.push(gestureState.dy);
          }

          if (storeDx.current.length === 5) {
            if (
              Math.abs(storeDx.current[4] - storeDx.current[0]) >
              Math.abs(storeDy.current[4] - storeDy.current[0])
            ) {
              if (
                !(locationX.current + dx.current > 0) ||
                !(locationX.current + dx.current < layoutSize.current.width)
              )
                return;

              if (
                activeGesture.current === '' ||
                activeGesture.current === 'track'
              ) {
                activeGesture.current = 'track';
                calculateMinMaxTime(
                  Math.floor(
                    (gestureState.dx * rtlMultiplier.current) /
                      trackFactor.current
                  ),
                  Math.floor(currentTime.current),
                  Math.floor(durationTime.current)
                );
                tipViewRef.current?.updateState({
                  showTip: true,
                  tipText: getForwardOrRewindTimeTipText(
                    symbol.current,
                    Math.floor(minTime.current),
                    Math.floor(maxTime.current)
                  ),
                  autoHide: false,
                });
              }
            } else {
              if (
                !(locationY.current + dy.current >= 0) ||
                !(locationY.current + dy.current <= layoutSize.current.height)
              )
                return;
              if (
                e.nativeEvent.locationX * rtlMultiplier.current <
                (layoutSize.current.width * rtlMultiplier.current) / 2
              ) {
                if (
                  activeGesture.current === '' ||
                  activeGesture.current === 'brightness'
                ) {
                  activeGesture.current = 'brightness';
                  if (gestureState.dy >= 0) {
                    seekBrightnessDy.current = -Math.round(
                      gestureState.dy / brightnessFactor.current
                    );
                    const boundHeight = clamp(
                      seekBrightness.current + seekBrightnessDy.current,
                      0,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    const originalBrightness = seekToOriginalValue(
                      boundHeight,
                      MAX_BRIGHTNESS,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    brightnessTipViewRef.current?.updateState({
                      showTip: true,
                      tipText: `${originalBrightness}%`,
                      icon: getBrightnessIcon(
                        originalBrightness,
                        MAX_BRIGHTNESS,
                        brightnessBarTheme.iconSize,
                        brightnessBarTheme.iconColor
                      ),
                    });
                    brightnessBarHeight.setValue(boundHeight);

                    onGestureMove?.(
                      GestureEventType.BRIGHTNESS,
                      originalBrightness
                    );
                  } else {
                    seekBrightnessDy.current = Math.round(
                      Math.abs(gestureState.dy) / brightnessFactor.current
                    );
                    const boundHeight = clamp(
                      seekBrightness.current + seekBrightnessDy.current,
                      0,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    const originalBrightness = seekToOriginalValue(
                      boundHeight,
                      MAX_BRIGHTNESS,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    brightnessTipViewRef.current?.updateState({
                      showTip: true,
                      tipText: `${originalBrightness}%`,
                      icon: getBrightnessIcon(
                        originalBrightness,
                        MAX_BRIGHTNESS,
                        brightnessBarTheme.iconSize,
                        brightnessBarTheme.iconColor
                      ),
                    });
                    brightnessBarHeight.setValue(boundHeight);
                    onGestureMove?.(
                      GestureEventType.BRIGHTNESS,
                      originalBrightness
                    );
                  }
                }
              } else {
                if (
                  activeGesture.current === '' ||
                  activeGesture.current === 'volume'
                ) {
                  activeGesture.current = 'volume';

                  if (gestureState.dy >= 0) {
                    seekVolumeDy.current = -Math.round(
                      gestureState.dy / volumeFactor.current
                    );
                    const boundHeight = clamp(
                      seekVolume.current + seekVolumeDy.current,
                      0,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );

                    const originalVolume = seekToOriginalValue(
                      boundHeight,
                      MAX_VOLUME,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    volumeTipViewRef.current?.updateState({
                      showTip: true,
                      tipText: `${originalVolume}%`,
                      icon: getVolumeIcon(
                        originalVolume,
                        MAX_VOLUME,
                        volumeBarTheme.iconSize,
                        volumeBarTheme.iconColor
                      ),
                    });
                    volumeBarHeight.setValue(boundHeight);
                    onGestureMove?.(GestureEventType.VOLUME, originalVolume);
                  } else {
                    seekVolumeDy.current = Math.round(
                      Math.abs(gestureState.dy) / volumeFactor.current
                    );
                    const boundHeight = clamp(
                      seekVolume.current + seekVolumeDy.current,
                      0,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );

                    const originalVolume = seekToOriginalValue(
                      boundHeight,
                      MAX_VOLUME,
                      layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
                    );
                    volumeTipViewRef.current?.updateState({
                      showTip: true,
                      tipText: `${originalVolume}%`,
                      icon: getVolumeIcon(
                        originalVolume,
                        MAX_VOLUME,
                        volumeBarTheme.iconSize,
                        volumeBarTheme.iconColor
                      ),
                    });
                    volumeBarHeight.setValue(boundHeight);
                    onGestureMove?.(GestureEventType.VOLUME, originalVolume);
                  }
                }
              }
            }
          }
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (
          !gestureEnabled.current ||
          !isSeekable.current ||
          layoutOption?.current !== 'advanced'
        )
          return;

        if (activeGesture.current === 'track') {
          const time = currentTime.current + minTime.current;
          onGestureEnd?.(GestureEventType.TRACK, time);
          tipViewRef.current?.updateState({
            showTip: false,
            autoHide: true,
          });
        } else if (activeGesture.current === 'volume') {
          volumeTipViewRef.current?.updateState({
            showTip: false,
            tipText: '',
          });
          const boundHeight = clamp(
            seekVolume.current + seekVolumeDy.current,
            0,
            layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
          );
          seekVolume.current = boundHeight;
          const originalVolume = seekToOriginalValue(
            boundHeight,
            MAX_VOLUME,
            layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
          );
          onGestureEnd?.(GestureEventType.VOLUME, originalVolume);
        } else {
          brightnessTipViewRef.current?.updateState({
            showTip: false,
            tipText: '',
          });
          const boundHeight = clamp(
            seekBrightness.current + seekBrightnessDy.current,
            0,
            layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
          );
          seekBrightness.current = boundHeight;
          const originalBrightness = seekToOriginalValue(
            boundHeight,
            MAX_BRIGHTNESS,
            layoutSize.current.height * BAR_HEIGHT_PERCENTAGE
          );
          onGestureEnd?.(GestureEventType.BRIGHTNESS, originalBrightness);
        }

        activeGesture.current = '';
        storeDx.current = [];
        storeDy.current = [];
      },
      onPanResponderTerminationRequest: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
      onPanResponderTerminate: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {},
      onShouldBlockNativeResponder: (
        e: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => true,
    })
  );

  return (
    <View
      style={[styles.container, style]}
      {...panResponder.current.panHandlers}
    >
      <TouchableOpacity
        style={styles.innerContainer}
        activeOpacity={1}
        onPress={onScreenTouch}
      >
        {playerConfig?.layoutMode !== 'basic' && (
          <RippleView
            ref={leftRippleViewRef}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: dimension.width / 4,
            }}
            rippleStyle={{ right: 0 }}
            rippleSize={dimension.height / 2}
          >
            <IconRewind
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
              size={RIPPLE_ICON_SIZE}
              color={RIPPLE_ICON_COLOR}
            />
          </RippleView>
        )}
        {playerConfig?.layoutMode !== 'basic' && (
          <RippleView
            ref={rightRippleViewRef}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: dimension.width / 4,
            }}
            rippleStyle={{ left: 0 }}
            rippleSize={dimension.height / 2}
          >
            <IconFastForward
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
              size={RIPPLE_ICON_SIZE}
              color={RIPPLE_ICON_COLOR}
            />
          </RippleView>
        )}

        {playerConfig?.layoutMode !== 'basic' && (
          <SeekBarTipView
            ref={volumeTipViewRef}
            parentStyle={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: dimension.width / 4,
            }}
            style={{
              backgroundColor: CONTAINER_BACKGROUND_COLOR,
              borderRadius: CONTAINER_BORDER_RADIUS,
            }}
            dimension={dimension}
            barHeight={volumeBarHeight}
            heightPercentage={BAR_HEIGHT_PERCENTAGE}
            icon={
              <IconVolume2
                size={volumeBarTheme.iconSize}
                color={volumeBarTheme.iconColor}
              />
            }
            theme={volumeBarTheme}
          />
        )}
        {playerConfig?.layoutMode !== 'basic' && (
          <SeekBarTipView
            ref={brightnessTipViewRef}
            parentStyle={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: dimension.width / 4,
            }}
            style={{
              backgroundColor: CONTAINER_BACKGROUND_COLOR,
              borderRadius: CONTAINER_BORDER_RADIUS,
            }}
            dimension={dimension}
            barHeight={brightnessBarHeight}
            heightPercentage={BAR_HEIGHT_PERCENTAGE}
            icon={
              <IconSun
                size={brightnessBarTheme.iconSize}
                color={brightnessBarTheme.iconColor}
              />
            }
            theme={brightnessBarTheme}
          />
        )}
        {playerConfig?.layoutMode !== 'basic' && (
          <TipView
            ref={tipViewRef}
            style={{
              backgroundColor: CONTAINER_BACKGROUND_COLOR,
              borderRadius: CONTAINER_BORDER_RADIUS,
            }}
            theme={tipViewTheme}
          />
        )}
        {error && (
          <ErrorView
            style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: CONTAINER_BACKGROUND_COLOR,
            }}
            theme={errorTheme}
            errorText={playerConfig?.errorText}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(GestureView);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
