import React, { useImperativeHandle } from 'react';
import {
  Animated,
  AppState,
  BackHandler,
  Dimensions,
  I18nManager,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {
  IconLock,
  IconPaly,
  IconPause,
  IconRepeat,
  IconUnlock,
  IconZap,
} from '../../assets/icons';
import {
  getAspectRatioTipText,
  getKeyByValue,
  getTimeTipText,
} from '../utils/StringUtil';
import FooterControl, { FooterControlRef } from './FooterControl';
import GestureView, {
  GestureEventType,
  MAX_BRIGHTNESS,
  MAX_VOLUME,
  TapEventType,
} from './GestureView';
import TipView, { TipViewRef, TipViewTheme } from './TipView';
import MoreControl, { MoreItem } from './MoreControl';
import {
  NexenTheme,
  DefaultTheme,
  DefaultSizesTheme,
  DefaultMiniSeekBarTheme,
  DefaultTagViewTheme,
} from '../utils/Theme';
import HeaderControl, { HeaderControlRef } from './HeaderControl';
import LineSeekBar, { LineSeekBarTheme } from './LineSeekBar';
import SpeedControl from './SpeedControl';
import PlayButton from './PlayButton';
import Loader, { LoaderTheme } from './Loader';
import { getAlphaColor } from '../utils/ColorUtil';
import { getBrightnessIcon, getVolumeIcon } from '../utils/ComponentUtil';
import PlaylistControl from './PlaylistControl';
import {
  AVPlaybackSource,
  AVPlaybackStatus,
  AVPlaybackStatusToSet,
  ResizeMode as AVResizeMode,
  Video,
  VideoFullscreenUpdateEvent,
  VideoReadyForDisplayEvent,
} from 'expo-av';
import * as Brightness from 'expo-brightness';
import { WrapperComponentRef } from '../hoc/withAnimation';

const ANIMATION_DURATION = 300;
const USE_NATIVE_DRIVER = false;
const FORWARD_OR_REWIND_DURATION = 10;

export type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type LayoutMode = 'basic' | 'intermediate' | 'advanced';
export type ControlHideMode = 'auto' | 'touch';
export type Dimension = { width: number; height: number };
export type ResizeMode = 'stretch' | 'contain' | 'cover' | undefined;
export type PlaylistItem = {
  title?: string;
  source: string;
  poster?: string;
};

const RESIZE_MODES = ['BEST_FIT', 'FIT_TO_SCREEN', 'FILL_TO_SCREEN'];
const RESIZE_MODE_VALUES: ResizeMode[] = ['contain', 'cover', 'stretch'];

export type NexenPlayerRef = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  skipNext: () => void;
  skipBack: () => void;
  reload: () => void;
  setLoop: (loop: boolean) => void;
  setMuted: (mute: boolean) => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setPlaylist: (list: PlaylistItem[], index?: number) => void;
  setActiveIndex: (index: number) => void;
  setResizeMode: (mode: ResizeMode) => void;
};

type NexenPlayerProps = {
  source: AVPlaybackSource;
  poster?: string | undefined;
  posterStyle?: StyleProp<ImageStyle>;
  // resizeMode?: ResizeMode;
  title?: string;
  loadingText?: string;
  errorText?: string;
  // volume?: number;
  // brightness?: number;
  // paused?: boolean;
  // muted?: boolean;
  // repeat?: boolean;
  // playbackSpeed?: number;
  doubleTapTime?: number;
  // doubleTapPlayPause?: boolean;
  controlTimeout?: number;
  controlHideMode?: ControlHideMode;
  layoutMode?: LayoutMode;
  // playList?: PlayListItem[];
  // playListIndex?: number;

  disableLargePlayButton?: boolean;
  disableBack?: boolean;
  disableRatio?: boolean;
  disableVolume?: boolean;
  disableMore?: boolean;
  disableSkip?: boolean;
  disableStop?: boolean;
  disableFullscreen?: boolean;
  disablePlaylist?: boolean;
  style?: StyleProp<ViewStyle>;
  theme?: NexenTheme;
  insets?: EdgeInsets;
  onBackPressed?: () => void;
  onPresentFullScreen?: () => void;
  onDismissFullScreen?: () => void;
  onPlay?: () => void;
  onPaused?: () => void;
  onStopped?: () => void;
  onSkipNext?: (index: number) => void;
  onSkipBack?: (index: number) => void;
  onVolumeChanged?: (volume: number) => void;
  onBrightnessChanged?: (brightness: number) => void;
  onMuteChanged?: (muted: boolean) => void;
  onLoopChanged?: (loop: boolean) => void;
  onSpeedChanged?: (speed: number) => void;
  onPlaylistItemSelected?: (index: number) => void;
};

const NexenPlayer = React.forwardRef<NexenPlayerRef, NexenPlayerProps>(
  (props, ref) => {
    const {
      source,
      poster,
      posterStyle,
      // resizeMode,
      doubleTapTime,
      controlHideMode,
      layoutMode,
      title,
      style,
      insets,
      // repeat,
      // playbackSpeed,
      // volume: playerVolume,
      // brightness: playerBrightness,
      // paused: playerPaused,
      // muted: mutePlayer,
      controlTimeout: controlTimeoutDelay,
      // disableLargeMode = false,
      // playList,
      // playListIndex,
      disableLargePlayButton,
      disableBack,
      disableRatio,
      disableVolume,
      disableMore,
      disableSkip,
      disableStop,
      // disableSubtitle,
      disableFullscreen,
      disablePlaylist,
      onBackPressed,
      onPresentFullScreen,
      onDismissFullScreen,
      onPlay,
      onPaused,
      onStopped,
      onSkipNext,
      onSkipBack,
      onVolumeChanged,
      onBrightnessChanged,
      onMuteChanged,
      onLoopChanged,
      onSpeedChanged,
      onPlaylistItemSelected,
      theme,
    } = props;
    // console.log(`NexenPlayer: called`);
    const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
    const [showControl, setShowControl] = React.useState(false);
    const [showSpeedControl, setShowSpeedControl] = React.useState(false);
    const [showPlaylistControl, setShowPlaylistControl] = React.useState(false);
    const [showMoreControl, setShowMoreControl] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(false);
    const [paused, setPaused] = React.useState(true);
    const [muted, setMuted] = React.useState(false);
    const [loop, setLoop] = React.useState(false);
    const [videoList, setVideoList] = React.useState<PlaylistItem[]>();
    const [videoIndex, setVideoIndex] = React.useState(0);
    const [resizeModeIndex, setResizeModeIndex] = React.useState(0);
    const [speed, setSpeed] = React.useState(1);
    const [locked, setLocked] = React.useState(false);
    const [volume, setVolume] = React.useState(80);
    const [brightness, setBrightness] = React.useState(40);

    const [trackInfo, setTrackInfo] = React.useState({
      trackTime: 0,
      totalTrackTime: 0,
      cachedTrackTime: 0,
    });

    const durationTime = React.useRef(0);
    const cachedTime = React.useRef(0);
    const currentTime = React.useRef(0);
    
    const isSeeking = React.useRef(false);
    const isSliding = React.useRef(false);
    const isSeekable = React.useRef(false);
    const gestureEnabled = React.useRef(false);
    const isStopped = React.useRef(false);
    const isVolumeSeekable = React.useRef(true);
    const isFullscreen = React.useRef(fullScreen);
    
    const moreControlRef = React.useRef<WrapperComponentRef>(null);
    const speedControlRef = React.useRef<WrapperComponentRef>(null);
    const playlistControlRef = React.useRef<WrapperComponentRef>(null);

    const videoRef = React.useRef<Video>(null);
    const tipViewRef = React.useRef<TipViewRef>(null);
    const headerControlRef = React.useRef<HeaderControlRef>(null);
    const footerControlRef = React.useRef<FooterControlRef>(null);

    const headerOpacity = React.useRef(new Animated.Value(0)).current;
    const headerTopMargin = React.useRef(new Animated.Value(-60)).current;
    const footerOpacity = React.useRef(new Animated.Value(0)).current;
    const footerBottomMargin = React.useRef(new Animated.Value(-60)).current;

    const controlTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        setPaused(false);
      },
      pause: () => {
        setPaused(true);
      },
      stop: () => {
        handleStopPlayback();
      },
      skipNext: () => {
        onVideoSkipNext();
      },
      skipBack: () => {
        onVideoSkipBack();
      },
      reload: () => {
        handleReloadVideo();
      },
      setLoop: (loop: boolean) => {
        setLoop(loop);
      },
      setMuted: (mute: boolean) => {
        setMuted(mute);
        isVolumeSeekable.current = !muted;
      },
      setVolume: (volume: number) => {
        setVolume(volume);
      },
      setBrightness: (brightness: number) => {
        setBrightness(brightness);
      },
      setPlaybackSpeed: (speed: number) => {
        setSpeed(speed);
      },
      setPlaylist: (list: PlaylistItem[], index: number= 0) => {
        setVideoList(list);
        if (index >= 0 && index < list.length) {
          setVideoIndex(index);
        }
      },
      setActiveIndex: (index: number) => {
        if (videoList) {
          if (index >= 0 && index < videoList.length) {
            videoRef.current?.unloadAsync().then(() => {
              setTrackInfo({
                trackTime: 0,
                totalTrackTime: 0,
                cachedTrackTime: 0,
              });
              videoRef.current?.loadAsync({ uri: videoList![index].source}).then(() => {
                setVideoIndex(index);
              });
            });
          }
        }
      },
      setResizeMode: (mode: ResizeMode) => {
        setResizeModeIndex(RESIZE_MODE_VALUES.indexOf(mode));
      },
    }));

    const nexenTheme = React.useMemo((): NexenTheme => {
      return {
        ...DefaultTheme,
        trackSeekBar: {
          ...DefaultTheme.trackSeekBar,
          ...theme?.trackSeekBar,
        },
        speedSeekBar: {
          ...DefaultTheme.speedSeekBar,
          ...theme?.speedSeekBar,
        },
        lineSeekBar: {
          ...DefaultTheme.lineSeekBar,
          ...theme?.lineSeekBar,
        },
        miniSeekBar: {
          ...DefaultMiniSeekBarTheme,
          ...theme?.miniSeekBar,
        },
        volumeSeekBar: {
          ...DefaultTheme.volumeSeekBar,
          ...theme?.volumeSeekBar,
        },
        brightnessSeekBar: {
          ...DefaultTheme.brightnessSeekBar,
          ...theme?.brightnessSeekBar,
        },
        lockButton: {
          ...DefaultTheme.lockButton,
          ...theme?.lockButton,
        },
        tagView: {
          ...DefaultTagViewTheme,
          ...theme?.tagView,
        },
        colors: {
          ...DefaultTheme.colors,
          ...theme?.colors,
        },
        sizes: {
          ...DefaultSizesTheme,
          ...theme?.sizes,
        },
        fonts: {
          ...theme?.fonts,
        },
      };
    }, [theme]);

    const ICON_SIZE_FACTOR = 0.8;
    const TAG_VIEW_ICON_SIZE = nexenTheme?.tagView?.iconSize!;
    const TAG_VIEW_ACTIVE_ICON_COLOR =
      nexenTheme?.tagView?.activeIconColor ||
      getAlphaColor(nexenTheme?.colors?.accentColor!, 0.7);
    const TAG_VIEW_INACTIVE_ICON_COLOR =
      nexenTheme?.tagView?.inactiveIconColor ||
      getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.5);

    const TIP_VIEW_ICON_SIZE = nexenTheme?.tipView?.iconSize;
    const TIP_VIEW_TEXT_SIZE = nexenTheme?.tipView?.textSize;
    const TIP_VIEW_ICON_COLOR =
      nexenTheme.tipView?.iconColor || nexenTheme.colors?.secondaryIconColor;
    const TIP_VIEW_TEXT_COLOR =
      nexenTheme?.tipView?.textColor || nexenTheme?.colors?.secondaryTextColor;

    const CONTAINER_BORDER_RADIUS = nexenTheme?.sizes?.modalCornerRadius;
    const CONTAINER_BACKGROUND_COLOR =
      nexenTheme?.colors?.modalBackgroundColor ||
      getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.7);

      const minValue = Math.min(
        Number(dimension.width),
        Number(dimension.height)
      );
      const MORE_CONTROL_CONTAINER_WIDTH = fullScreen
        ? minValue * 0.55 + insets?.right!
        : minValue * 0.7;
        const SPEED_CONTROL_CONTAINER_HEIGHT = fullScreen
        ? minValue * 0.2 + insets?.bottom!
        : minValue * 0.3;
      const PLAYLIST_CONTROL_CONTAINER_HEIGHT = fullScreen
        ? minValue * 0.3 + insets?.bottom!
        : minValue * 0.35;

    const LINE_SEEK_BAR_HEIGHT = 2;

    const rtlMultiplier = React.useRef(1);
    const isRTL = I18nManager.isRTL;
    rtlMultiplier.current = isRTL ? -1 : 1;

    const tipViewTheme = React.useMemo((): TipViewTheme => {
      return {
        textColor: TIP_VIEW_TEXT_COLOR,
        textSize: TIP_VIEW_TEXT_SIZE,
        font: nexenTheme?.fonts?.secondaryFont,
      };
    }, [nexenTheme]);

    const loaderTheme = React.useMemo((): TipViewTheme => {
      return {
        iconSize: 40,
        iconColor: TIP_VIEW_ICON_COLOR,
        textColor: TIP_VIEW_TEXT_COLOR,
        textSize: 16,
        font: nexenTheme?.fonts?.secondaryFont,
      };
    }, [nexenTheme]);

    const lineSeekBarTheme = React.useMemo((): LineSeekBarTheme => {
      return {
        lineHeight: LINE_SEEK_BAR_HEIGHT,
        lineColor:
          nexenTheme?.lineSeekBar?.lineColor || nexenTheme?.colors?.accentColor,
        lineUnderlayColor:
          nexenTheme?.lineSeekBar?.lineUnderlayColor ||
          getAlphaColor(nexenTheme?.colors?.secondaryColor!, 0.3),
      };
    }, [nexenTheme]);

    const onLayoutChange = async (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      const { width: w, height: h } = dimension;
      if (w !== width || h !== height) {
        setDimension({ width, height });
        // console.log(`onLayoutChange:: width: ${width} height: ${height}`);
      }
    };

    const onTapDetected = React.useCallback(
      async (event: TapEventType, value?: number) => {

        switch (event) {
          case TapEventType.SINGLE_TAP:
            if (showMoreControl) {
              hideMoreOptions();
              gestureEnabled.current = true;
              break;
            }
            if (showSpeedControl) {
              hidePlaybackSpeedControl();
              gestureEnabled.current = true;
              break;
            }
            if (showPlaylistControl) {
              hideVideoListControl();
              gestureEnabled.current = true;
              break;
            }
            if (showControl) {
              hideMainControl();
            } else {
              showMainControl();
            }
            break;
          case TapEventType.DOUBLE_TAP_LEFT:
          case TapEventType.DOUBLE_TAP_RIGHT:
            if (value) {
              await videoRef.current?.setStatusAsync({
                positionMillis: value * 1000,
              });
              setTrackInfo((prevState) => {
                return {
                  ...prevState,
                  trackTime: value,
                };
              });
            }
            break;
          case TapEventType.DOUBLE_TAP_MIDDLE:
            handleDoubleTapPlayPause();
            break;
        }
      },
      [
        showControl,
        showMoreControl,
        showSpeedControl,
        showPlaylistControl,
        paused,
      ]
    );

    const onGestureMove = React.useCallback(
      (event: GestureEventType, value: number) => {
        switch (event) {
          case GestureEventType.VOLUME:
            headerControlRef.current?.updateIconTagView({
              volumeIcon: getVolumeIcon(
                value,
                MAX_VOLUME,
                TAG_VIEW_ICON_SIZE,
                TIP_VIEW_ICON_COLOR
              ),
            });
            videoRef.current?.setStatusAsync({ volume: value / 100 });
            onVolumeChanged?.(value / 100);
            break;
          case GestureEventType.BRIGHTNESS:
            headerControlRef.current?.updateIconTagView({
              brightnessIcon: getBrightnessIcon(
                value,
                MAX_BRIGHTNESS,
                TAG_VIEW_ICON_SIZE,
                TIP_VIEW_ICON_COLOR
              ),
            });
            Brightness.setBrightnessAsync(value / 100);
            onBrightnessChanged?.(value / 100);
            break;
        }
      },
      []
    );

    const onGestureEnd = React.useCallback(
      async (event: GestureEventType, value: number) => {
        switch (event) {
          case GestureEventType.TRACK:
            videoRef.current?.setStatusAsync({ positionMillis: value * 1000 });
            setTrackInfo((prevState) => {
              return {
                ...prevState,
                trackTime: value,
              };
            });
            break;
          case GestureEventType.VOLUME:
            headerControlRef.current?.updateIconTagView({
              volumeIcon: getVolumeIcon(
                value,
                MAX_VOLUME,
                TAG_VIEW_ICON_SIZE,
                TIP_VIEW_ICON_COLOR
              ),
            });
            setVolume(value);
            videoRef.current?.setStatusAsync({ volume: value / 100 });
            onVolumeChanged?.(value / 100);
            break;
          case GestureEventType.BRIGHTNESS:
            headerControlRef.current?.updateIconTagView({
              brightnessIcon: getBrightnessIcon(
                value,
                MAX_BRIGHTNESS,
                TAG_VIEW_ICON_SIZE,
                TIP_VIEW_ICON_COLOR
              ),
            });
            setBrightness(value);
            Brightness.setBrightnessAsync(value / 100);
            onBrightnessChanged?.(value / 100);
            break;
        }
      },
      []
    );

    const showMainControl = () => {
      setShowControl(true);
    };

    const hideMainControl = () => {
      startControlHideAnimation(() => {
        setShowControl(false);
      });
    };

    const setControlTimeout = () => {
      controlTimeoutRef.current = setTimeout(() => {
        hideMainControl();
      }, controlTimeoutDelay);
    };

    const clearControlTimeout = () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };

    const resetControlTimeout = () => {
      clearControlTimeout();
      setControlTimeout();
    };

    const showMoreOptions = () => {
      setShowMoreControl(true);
    };

    const hideMoreOptions = () => {
      moreControlRef.current?.hide(() => {
        setShowMoreControl(false);
      });
    };

    const showPlaybackSpeedControl = () => {
      setShowSpeedControl(true);
    };

    const hidePlaybackSpeedControl = () => {
      speedControlRef.current?.hide(() => {
        setShowSpeedControl(false);
      });
    };
    
    const showVideoListControl = () => {
      setShowPlaylistControl(true);
    };

    const hideVideoListControl = () => {
      playlistControlRef.current?.hide(() => {
        setShowPlaylistControl(false);
      });
    };

    const startControlShowAnimation = (
      callback?: Animated.EndCallback | undefined
    ) => {
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(headerTopMargin, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(footerBottomMargin, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start(callback);
    };

    const startControlHideAnimation = (
      callback?: Animated.EndCallback | undefined
    ) => {
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(headerTopMargin, {
          toValue: -60,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(footerOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(footerBottomMargin, {
          toValue: -60,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start(callback);
    };

    React.useEffect(() => {
      if (showControl) {
        startControlShowAnimation();
        if (controlHideMode && controlHideMode == 'auto') {
          setControlTimeout();
        }
      } else {
        if (controlHideMode && controlHideMode == 'auto') {
          clearControlTimeout();
        }
      }

      if (layoutMode === 'advanced') {
        headerControlRef.current?.updateIconTagView({
          volumeIcon: getVolumeIcon(
            volume,
            MAX_VOLUME,
            TAG_VIEW_ICON_SIZE,
            TIP_VIEW_ICON_COLOR
          ),
          brightnessIcon: getBrightnessIcon(
            brightness,
            MAX_BRIGHTNESS,
            TAG_VIEW_ICON_SIZE,
            TIP_VIEW_ICON_COLOR
          ),
          repeatIcon: loop ? (
            <IconRepeat
              size={TAG_VIEW_ICON_SIZE}
              color={TAG_VIEW_ACTIVE_ICON_COLOR}
            />
          ) : (
            <IconRepeat
              size={TAG_VIEW_ICON_SIZE}
              color={TAG_VIEW_INACTIVE_ICON_COLOR}
            />
          ),
          speedIcon:
            speed !== 1.0 ? (
              <IconZap
                size={TAG_VIEW_ICON_SIZE}
                color={TAG_VIEW_ACTIVE_ICON_COLOR}
              />
            ) : (
              <IconZap
                size={TAG_VIEW_ICON_SIZE}
                color={TAG_VIEW_INACTIVE_ICON_COLOR}
              />
            ),
        });
      }
    }, [showControl, fullScreen, locked, volume, brightness, layoutMode]);

    React.useEffect(() => {
      if (showMoreControl) {
        moreControlRef.current?.show();
        return;
      }

      if (showSpeedControl) {
        speedControlRef.current?.show();
        return;
      }

      if (showPlaylistControl) {
        playlistControlRef.current?.show();
        return;
      }
    }, [
      showMoreControl,
      showSpeedControl,
      showPlaylistControl,
    ]);

    React.useEffect(() => {
      currentTime.current = trackInfo.trackTime;
      cachedTime.current = trackInfo.cachedTrackTime;
      durationTime.current = trackInfo.totalTrackTime;
    }, [trackInfo]);

    React.useEffect(() => {
      if (isSeekable.current) {
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: getAspectRatioTipText(RESIZE_MODES[resizeModeIndex]),
          autoHide: true,
        });
      }
    }, [resizeModeIndex]);

    React.useEffect(() => {
      isFullscreen.current = fullScreen;
    }, [fullScreen]);

    React.useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => {
        if (backHandler) {
          backHandler.remove();
        }
        if (controlTimeoutRef.current) {
          clearTimeout(controlTimeoutRef.current);
        }
      };
    }, []);

    const onBackPress = React.useCallback(() => {
      if (fullScreen) {
        setFullScreen(false);
        onDismissFullScreen?.();
      } else {
        onBackPressed?.();
      }
      return true;
    }, [fullScreen]);

    const onAspectRatioPress = React.useCallback(() => {
      if (resizeModeIndex < RESIZE_MODE_VALUES.length - 1) {
        setResizeModeIndex((prevState) => prevState + 1);
      } else {
        setResizeModeIndex(0);
      }
    }, [resizeModeIndex]);

    const onMorePress = React.useCallback(() => {
      showMoreOptions();
      hideMainControl();
      gestureEnabled.current = false;
    }, []);

    const onMoreItemPress = React.useCallback(
      (item: MoreItem) => {
        switch (item.id) {
          case 'lock':
            hideMoreOptions();
            setLocked(true);
            isSeekable.current = false;
            gestureEnabled.current = false;
            tipViewRef.current?.updateState({
              showTip: true,
              tipText: 'Locked',
              autoHide: true,
              withIcon: true,
              icon: (
                <IconLock
                  size={TIP_VIEW_ICON_SIZE}
                  color={TIP_VIEW_ICON_COLOR}
                />
              ),
            });
            break;
          case 'speed':
            hideMoreOptions();
            showPlaybackSpeedControl();
            gestureEnabled.current = false;
            break;
          case 'repeat':
            hideMoreOptions();
            gestureEnabled.current = true;
            handleRepeatVideo();
            break;
          case 'reload':
            hideMoreOptions();
            gestureEnabled.current = true;
            handleReloadVideo();
            break;
          case 'playlist':
            hideMoreOptions();
            showVideoListControl();
            gestureEnabled.current = false;
            break;
        }
      },
      [loop, paused, videoList]
    );

    const onSpeedChange = React.useCallback((value: string) => {
      const newSpeed = Number(value);
      tipViewRef.current?.updateState({
        showTip: true,
        tipText: `${newSpeed}x Speed`,
        autoHide: true,
        withIcon: true,
        icon: <IconZap size={TIP_VIEW_ICON_SIZE} color={TIP_VIEW_ICON_COLOR} />,
      });
      setSpeed(newSpeed);
      onSpeedChanged?.(newSpeed);
    }, []);

    const handleDoubleTapPlayPause = () => {
      if (paused) {
        setPaused(false);
        onPlay?.();
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: 'Playing',
          autoHide: true,
          withIcon: true,
          icon: (
            <IconPaly size={TIP_VIEW_ICON_SIZE} color={TIP_VIEW_ICON_COLOR} />
          ),
        });
      } else {
        setPaused(true);
        onPaused?.();
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: 'Paused',
          autoHide: true,
          withIcon: true,
          icon: (
            <IconPause size={TIP_VIEW_ICON_SIZE} color={TIP_VIEW_ICON_COLOR} />
          ),
        });
      }
    };

    /* FooterControl Callback */
    const onPlayButtonPress = () => {
      console.log(`onPlayButtonPress`);
      // playerRef.current?.play();
      setPaused(false);
      onPlay?.();
    };

    const onStopPress = () => {
      console.log(`onStopPress`);
      // isStopped.current = false;
      handleStopPlayback();
    };

    const handleStopPlayback = () => {
      console.log(`handleStopPlayback`);
      isStopped.current = true;
      videoRef.current?.setStatusAsync({ positionMillis: 0 });
      setPaused(true);
      onStopped?.();
    };

    const handleRepeatVideo = () => {
      tipViewRef.current?.updateState({
        showTip: true,
        tipText: !loop ? 'Repeat On' : 'Repeat Off',
        autoHide: true,
        withIcon: true,
        icon: (
          <IconRepeat
            size={TIP_VIEW_ICON_SIZE}
            color={TIP_VIEW_ICON_COLOR}
          />
        ),
      });
      setLoop((prevState) => !prevState);
    }

    const handleReloadVideo = () => {
      videoRef.current?.unloadAsync().then(() => {
        videoRef.current
          ?.loadAsync(
            videoList ? { uri: videoList[videoIndex].source } : source,
            { shouldPlay: !paused }
          )
          .then(() => {
            console.log(`reloaded!!`)
          });
      });
    }

    const onRewind = () => {
      const time = trackInfo.trackTime - FORWARD_OR_REWIND_DURATION;
      videoRef.current?.setStatusAsync({ positionMillis: time * 1000 });
      setTrackInfo((prevState) => {
        return {
          ...prevState,
          trackTime: time,
        };
      });
    };

    const onFastForward = () => {
      const time = trackInfo.trackTime + FORWARD_OR_REWIND_DURATION;
      videoRef.current?.setStatusAsync({ positionMillis: time * 1000 });
      setTrackInfo((prevState) => {
        return {
          ...prevState,
          trackTime: time,
        };
      });
    };

    const onVideoSkipNext = () => {
      if (videoList) {
        if (videoIndex! < videoList.length - 1) {
          videoRef.current?.unloadAsync().then(() => {
            setTrackInfo({
              trackTime: 0,
              totalTrackTime: 0,
              cachedTrackTime: 0,
            });
            const index = videoIndex + 1;
            videoRef.current?.loadAsync({ uri: videoList![index].source}).then(() => {
              setVideoIndex(index);
              onSkipNext?.(index);
            });
          });
        }
      }
    };

    const onVideoSkipBack = () => {
      if (videoList) {
        if (videoIndex > 0) {
          videoRef.current?.unloadAsync().then(() => {
            setTrackInfo({
              trackTime: 0,
              totalTrackTime: 0,
              cachedTrackTime: 0,
            });
            const index = videoIndex - 1;
            videoRef.current?.loadAsync({ uri: videoList![index].source}).then(() => {
              setVideoIndex(index);
              onSkipBack?.(index);
            });
          });
        }
      }
    };
    const onVideoListPress = () => {
      hideMainControl();
      // showVideoListControl();
      playlistControlRef.current?.show();
      gestureEnabled.current = false;
    };

    const onPlaylistItemPress = (index: number) => {
      if (videoIndex !== index) {
        videoRef.current?.unloadAsync().then(() => {
          setTrackInfo({
            trackTime: 0,
            totalTrackTime: 0,
            cachedTrackTime: 0,
          });
          setPaused(false);
          onPlay?.();
          videoRef.current?.loadAsync({ uri: videoList![index].source })
            .then(() => {
              setVideoIndex(index);
              onPlaylistItemSelected?.(index);
            });
        });
      }
    };

    const onTogglePlayPause = () => {
      if (paused) {
        onPlay?.();
      } else {
        onPaused?.();
      }
      setPaused((prevState) => !prevState);
    };

    const onToggleFullScreen = () => {
      if (fullScreen) {
        onDismissFullScreen?.();
      } else {
        onPresentFullScreen?.();
      }
      setFullScreen((prevState) => !prevState);
    };

    const onToggleVolume = () => {
      tipViewRef.current?.updateState({
        showTip: true,
        tipText: !muted ? 'Sound Off' : 'Sound On',
        autoHide: true,
      });
      isVolumeSeekable.current = !(!muted);
      onMuteChanged?.(!muted);
      setMuted((prevState) => !prevState);
    };

    /* Slide Button Callback */
    const onSlideStart = React.useCallback(() => {
      isSliding.current = true;
    }, []);

    const onSlideEnd = React.useCallback(() => {
      isSliding.current = false;
    }, []);

    const onReachedToStart = React.useCallback(() => {

    }, []);

    const onReachedToEnd = React.useCallback(() => {
      setLocked(false);
      isSeekable.current = true;
      gestureEnabled.current = true;
      tipViewRef.current?.updateState({
        showTip: true,
        tipText: 'Unlocked',
        autoHide: true,
        withIcon: true,
        icon: (
          <IconUnlock size={TIP_VIEW_ICON_SIZE} color={TIP_VIEW_ICON_COLOR} />
        ),
      });
    }, []);

    /* SeekBar Callback */
    const onSeekStart = React.useCallback(
      (value: number, totalValue: number) => {
        isSeeking.current = true;
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: getTimeTipText(value, totalValue),
          autoHide: false,
        });
      },
      []
    );

    const onSeekUpdate = React.useCallback(
      (value: number, totalValue: number) => {
        if (isSeeking.current) {
          tipViewRef.current?.updateState({
            tipText: getTimeTipText(value, totalValue),
          });
        }
      },
      []
    );

    const onSeekEnd = React.useCallback((value: number) => {
      isSeeking.current = false;
      videoRef.current?.setStatusAsync({ positionMillis: value * 1000 });
      setTrackInfo((prevState) => {
        return { ...prevState, trackTime: value };
      });

      tipViewRef.current?.updateState({ showTip: false, autoHide: true });
    }, []);

    /* Volume SeekBar Callback */
    const onVolumeSeekStart = React.useCallback(
      async (value: number, totalValue: number) => {
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: `Volume : ${value}%`,
          autoHide: false,
        });
        videoRef.current?.setStatusAsync({ volume: value / 100 });
        onVolumeChanged?.(value / 100);
      },
      []
    );

    const onVolumeSeekUpdate = React.useCallback(
      async (value: number, totalValue: number) => {
        tipViewRef.current?.updateState({
          showTip: true,
          tipText: `Volume : ${value}%`,
          autoHide: false,
        });
        videoRef.current?.setStatusAsync({ volume: value / 100 });
        onVolumeChanged?.(value / 100);
      },
      []
    );

    const onVolumeSeekEnd = React.useCallback(async (value: number) => {
      setVolume(value);
      tipViewRef.current?.updateState({ showTip: false, autoHide: true });
      videoRef.current?.setStatusAsync({ volume: value / 100 });
      onVolumeChanged?.(value / 100);
    }, []);

    /* VLCPlayer Callback */

    const onLoadStart = React.useCallback(() => {
      setLoading(true);
    }, []);

    const onLoad = React.useCallback((status: AVPlaybackStatus) => {
      console.log(`onLoad!!: ${JSON.stringify(status)}`);
      setLoading(false);
      setError(!status.isLoaded);
      if (status.isLoaded) {
        setTrackInfo((prevState) => {
          return {
            ...prevState,
            totalTrackTime: status.durationMillis! / 1000,
          };
        });
      }

      isSeekable.current = status.isLoaded;
      gestureEnabled.current = status.isLoaded;
      isStopped.current = false;
    }, []);

    const onPlaybackStatusUpdate = React.useCallback(
      (status: AVPlaybackStatus) => {
        // console.log(`onPlaybackStatusUpdate!!: ${JSON.stringify(status)}`);
        if (status.isLoaded) {
          if (!isSeeking.current) {
            setTrackInfo({
              trackTime: status.positionMillis! / 1000,
              cachedTrackTime: status.playableDurationMillis! / 1000,
              totalTrackTime: status.durationMillis! / 1000,
            });
          }

          if (!status.isLooping && status.didJustFinish) {
            if (videoList) {
              if (videoIndex! < videoList.length - 1) {
                onVideoSkipNext();
              } else {
                handleStopPlayback();
              }
            } else {
              handleStopPlayback();
            }
          }
        }
      },
      []
    );

    const onReadyForDisplay = React.useCallback(
      (event: VideoReadyForDisplayEvent) => {
        // console.log(`onReadyForDisplay!!: ${JSON.stringify(event)}`);
      },
      []
    );

    const onFullscreenUpdate = React.useCallback(
      (event: VideoFullscreenUpdateEvent) => {
        // console.log(`onPlaybackRateChange!!: ${JSON.stringify(event)}`);
      },
      []
    );    

    const onError = React.useCallback((error: string) => {
      console.log(`onError: ${JSON.stringify(error)}`);
      setError(true);
    }, []);

    const playerStyle: StyleProp<ViewStyle> = fullScreen
      ? {
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 9999,
        }
      : { position: 'relative' };

    return (
      <View
        style={[styles.playerContainer, style, playerStyle]}
        onLayout={onLayoutChange}
      >
        <Video
          ref={videoRef}
          style={styles.player}
          source={videoList ? { uri: videoList[videoIndex].source } : source}
          posterSource={{
            uri: videoList ? videoList[videoIndex].poster : poster,
          }}
          posterStyle={posterStyle}
          shouldPlay={!paused}
          isMuted={muted}
          volume={volume! / 100}
          isLooping={loop}
          rate={speed}
          resizeMode={getKeyByValue(RESIZE_MODE_VALUES[resizeModeIndex]!)}
          progressUpdateIntervalMillis={500}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={onError}
          onReadyForDisplay={onReadyForDisplay}
          onFullscreenUpdate={onFullscreenUpdate}
        />

        <GestureView
          fullScreen={fullScreen}
          locked={locked}
          error={error}
          isSeeking={isSeeking}
          isSliding={isSliding}
          isSeekable={isSeekable}
          gestureEnabled={gestureEnabled}
          durationTime={durationTime}
          currentTime={currentTime}
          layoutMode={layoutMode}
          dimension={dimension}
          volume={volume}
          brightness={brightness}
          nexenTheme={nexenTheme}
          doubleTapTime={doubleTapTime}
          onTapDetected={onTapDetected}
          onGestureMove={onGestureMove}
          onGestureEnd={onGestureEnd}
        />

        <>
          {/* top control bar */}
          {showControl && (
            <HeaderControl
              ref={headerControlRef}
              title={videoList ? videoList[videoIndex!].title : title}
              opacity={headerOpacity}
              marginTop={headerTopMargin}
              fullScreen={fullScreen}
              locked={locked}
              nexenTheme={nexenTheme}
              layoutMode={layoutMode}
              insets={insets}
              disableBack={disableBack}
              disableRatio={disableRatio}
              disableMore={disableMore}
              onBackPress={onBackPress}
              onAspectRatioPress={onAspectRatioPress}
              onMorePress={onMorePress}
            />
          )}

          {/* bottom control bar */}
          {showControl && (
            <FooterControl
              ref={footerControlRef}
              opacity={footerOpacity}
              marginBottom={footerBottomMargin}
              fullScreen={fullScreen}
              muted={muted!}
              locked={locked}
              nexenTheme={nexenTheme}
              layoutMode={layoutMode}
              insets={insets}
              paused={paused}
              isSeekable={isSeekable}
              isVolumeSeekable={isVolumeSeekable}
              trackTime={trackInfo.trackTime}
              cachedTrackTime={trackInfo.cachedTrackTime}
              totalTrackTime={trackInfo.totalTrackTime}
              volume={volume!}
              totalVolume={MAX_VOLUME}
              disableSkip={disableSkip}
              disableStop={disableStop}
              disableFullscreen={disableFullscreen}
              disableRatio={disableRatio}
              onStopPress={onStopPress}
              onPlayPress={onTogglePlayPause}
              onFullScreenPress={onToggleFullScreen}
              onVolumePress={onToggleVolume}
              onAspectRatioPress={onAspectRatioPress}
              onRewind={onRewind}
              onFastForward={onFastForward}
              onSkipNext={onVideoSkipNext}
              onSkipBack={onVideoSkipBack}
              onSeekStart={onSeekStart}
              onSeekUpdate={onSeekUpdate}
              onSeekEnd={onSeekEnd}
              onVolumeSeekStart={onVolumeSeekStart}
              onVolumeSeekUpdate={onVolumeSeekUpdate}
              onVolumeSeekEnd={onVolumeSeekEnd}
              onSlideStart={onSlideStart}
              onSlideEnd={onSlideEnd}
              onReachedToStart={onReachedToStart}
              onReachedToEnd={onReachedToEnd}
            />
          )}
          {/* bottom line bar */}
          {!showControl &&
            !showMoreControl &&
            !showSpeedControl &&
            !showPlaylistControl && (
              <LineSeekBar
                trackTime={trackInfo.trackTime}
                totalTrackTime={trackInfo.totalTrackTime}
                layoutWidth={dimension.width}
                theme={lineSeekBarTheme}
              />
            )}

          {showMoreControl && (
            <MoreControl
              ref={moreControlRef}
              animateFrom={'RIGHT'}
              distance={MORE_CONTROL_CONTAINER_WIDTH}
              style={{ 
                width: MORE_CONTROL_CONTAINER_WIDTH,
                backgroundColor: CONTAINER_BACKGROUND_COLOR,
                borderTopLeftRadius: CONTAINER_BORDER_RADIUS,
                borderBottomLeftRadius: CONTAINER_BORDER_RADIUS,
               }}
              fullScreen={fullScreen}
              disablePlaylist={disablePlaylist}
              insets={insets}
              nexenTheme={nexenTheme}
              onItemPress={onMoreItemPress}
            />
          )}

          {showSpeedControl && (
            <SpeedControl
              ref={speedControlRef}
              animateFrom={'BOTTOM'}
              distance={SPEED_CONTROL_CONTAINER_HEIGHT}
              style={{
                height: SPEED_CONTROL_CONTAINER_HEIGHT,
                backgroundColor: CONTAINER_BACKGROUND_COLOR,
                borderTopLeftRadius: CONTAINER_BORDER_RADIUS,
                borderTopRightRadius: CONTAINER_BORDER_RADIUS,
              }}
              fullScreen={fullScreen}
              insets={insets}
              currentSpeed={speed}
              nexenTheme={nexenTheme}
              onSpeedChange={onSpeedChange}
            />
          )}

          {showPlaylistControl && (
            <PlaylistControl
              ref={playlistControlRef}
              animateFrom={'BOTTOM'}
              distance={PLAYLIST_CONTROL_CONTAINER_HEIGHT}
              style={{
                height: PLAYLIST_CONTROL_CONTAINER_HEIGHT,
                backgroundColor: CONTAINER_BACKGROUND_COLOR,
                borderTopLeftRadius: CONTAINER_BORDER_RADIUS,
                borderTopRightRadius: CONTAINER_BORDER_RADIUS,
              }}
              playlist={videoList}
              playlistIndex={videoIndex}
              fullScreen={fullScreen}
              nexenTheme={nexenTheme}
              insets={insets}
              onPlaylistItemPress={onPlaylistItemPress}
            />
          )}

          {!showControl &&
            !showMoreControl &&
            !showSpeedControl &&
            !showPlaylistControl &&
            !loading &&
            !locked &&
            !error &&
            paused &&
            !disableLargePlayButton && (
              <PlayButton
                dimension={dimension}
                onPlayPress={onPlayButtonPress}
              />
            )}

          {/* Loader */}
          {!error && loading && (
            <Loader
              style={{
                backgroundColor: CONTAINER_BACKGROUND_COLOR,
                borderRadius: CONTAINER_BORDER_RADIUS,
              }}
              theme={loaderTheme}
            />
          )}

          {layoutMode !== 'basic' && (
            <TipView
              ref={tipViewRef}
              style={{
                backgroundColor: CONTAINER_BACKGROUND_COLOR,
                borderRadius: CONTAINER_BORDER_RADIUS,
              }}
              theme={tipViewTheme}
            />
          )}
        </>
      </View>
    );
  }
);

export default NexenPlayer;

NexenPlayer.defaultProps = {
  doubleTapTime: 300,
  // doubleTapPlayPause: true,
  controlTimeout: 5000,
  controlHideMode: 'touch',
  layoutMode: 'intermediate',
  // resizeMode: 'contain',
  // muted: false,
  // repeat: false,
  // playbackSpeed: 1.0,
  // volume: 80,
  // brightness: 40,
  // playListIndex: 0,
  disableLargePlayButton: false,
  disableBack: false,
  disableRatio: false,
  disableMore: false,
  disableSkip: false,
  disableStop: false,
  disableVolume: false,
  disableFullscreen: false,
  disablePlaylist: false,
  insets: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
};

const styles = StyleSheet.create({
  playerContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  player: {
    width: '100%',
    height: '100%',
  },
});
