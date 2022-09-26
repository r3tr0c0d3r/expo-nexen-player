import React, { useImperativeHandle } from 'react';
import {
  Animated,
  I18nManager,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  IconAspectRatio,
  IconChevronLeft,
  IconMoreHorizontal,
} from '../assets/icons';
import IconButton from './IconButton';
import GradientView from './GradientView';
import type { NexenTheme } from '../utils/Theme';
import type { EdgeInsets, NexenConfig } from './NexenPlayer';
import IconTagView, {
  IconTagViewRef,
  IconTagViewState,
  IconTagViewTheme,
} from './IconTagView';
import { getAlphaColor } from '../utils/ColorUtil';

export type HeaderControlRef = {
  updateIconTagView: (newState: IconTagViewState) => void;
};

type HeaderControlProps = {
  title?: string;
  opacity: Animated.Value;
  marginTop: Animated.Value;
  fullScreen: boolean;
  locked: boolean;
  insets?: EdgeInsets;
  playerConfig?: NexenConfig;
  nexenTheme?: NexenTheme;
  onBackPress?: () => void;
  onAspectRatioPress?: () => void;
  onMorePress?: () => void;
};

const HeaderControl = React.forwardRef<HeaderControlRef, HeaderControlProps>(
  (props, ref) => {
    const {
      title,
      opacity,
      marginTop,
      fullScreen,
      locked,
      insets,
      playerConfig,
      nexenTheme,
      onBackPress,
      onAspectRatioPress,
      onMorePress,
    } = props;

    const iconTagViewRef = React.useRef<IconTagViewRef>(null);

    const ICON_SIZE = nexenTheme?.sizes?.primaryIconSize;
    const ICON_COLOR = nexenTheme?.colors?.primaryIconColor;
    const TITLE_TEXT_SIZE = nexenTheme?.sizes?.primaryTextSize;
    const TITLE_TEXT_COLOR = nexenTheme?.colors?.primaryTextColor;
    const CONTAINER_VERTICAL_PADDING = fullScreen
      ? insets?.top! > 0
        ? insets?.top!
        : nexenTheme?.sizes?.paddingVertical
      : nexenTheme?.sizes?.paddingVertical;
    const CONTAINER_HORIZONTAL_PADDING = fullScreen
      ? (insets?.left! + insets?.right!) / 2 > 0
        ? (insets?.left! + insets?.right!) / 2
        : nexenTheme?.sizes?.paddingHorizontal
      : nexenTheme?.sizes?.paddingHorizontal;
    const CONTAINER_HEIGHT =
      nexenTheme?.sizes?.primaryIconSize! +
      10 * 2 +
      16 +
      CONTAINER_VERTICAL_PADDING!;
    const isRTL = I18nManager.isRTL;

    useImperativeHandle(ref, () => ({
      updateIconTagView: (newState: IconTagViewState) => {
        iconTagViewRef.current?.updateState(newState);
      },
    }));

    const iconTagViewTheme = React.useMemo((): IconTagViewTheme => {
      return {
        height: nexenTheme?.tagView?.height,
        cornerRadius: nexenTheme?.tagView?.cornerRadius,
        borderWidth: nexenTheme?.tagView?.borderWidth,
        iconSize: nexenTheme?.tagView?.iconSize!,
        textSize: nexenTheme?.tagView?.textSize,
        textLineHeight: nexenTheme?.tagView?.textLineHeight,
        iconColor:
          nexenTheme?.tagView?.iconColor || nexenTheme?.colors?.primaryColor,
        activeIconColor:
          nexenTheme?.tagView?.activeIconColor ||
          getAlphaColor(nexenTheme?.colors?.accentColor!, 0.7),
        inactiveIconColor:
          nexenTheme?.tagView?.inactiveIconColor ||
          getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.5),
        textColor:
          nexenTheme?.tagView?.textColor ||
          nexenTheme?.colors?.secondaryTextColor,
        borderColor:
          nexenTheme?.tagView?.borderColor ||
          getAlphaColor(nexenTheme?.colors?.accentColor!, 0.7),
        backgroundColor:
          nexenTheme?.tagView?.backgroundColor ||
          getAlphaColor(nexenTheme?.colors?.primaryColor!, 0.0),
      };
    }, [nexenTheme, fullScreen]);

    const titleTextStyle = {
      fontSize: TITLE_TEXT_SIZE,
      color: TITLE_TEXT_COLOR,
      fontFamily: nexenTheme?.fonts?.primaryFont,
    };

    return (
      <Animated.View
        style={[
          styles.container,
          { height: CONTAINER_HEIGHT },
          { opacity, marginTop },
        ]}
      >
        <GradientView
          style={{
            width: '100%',
            height: '100%',
          }}
          startOpacity={0.5}
          middleOpacity={0.2}
          endOpacity={0.0}
        />

        <TouchableHighlight
          style={[
            styles.innerContainer,
            {
              paddingTop: CONTAINER_VERTICAL_PADDING,
              paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={[styles.iconButtonContainer, { flexShrink: 1 }]}>
                {!locked && !playerConfig?.disableBack && (
                  <IconButton
                    style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                    onPress={onBackPress}
                  >
                    <IconChevronLeft size={ICON_SIZE} color={ICON_COLOR} />
                  </IconButton>
                )}

                <Text
                  style={[styles.titleText, titleTextStyle]}
                  numberOfLines={2}
                >
                  {title?.toUpperCase()}
                </Text>
              </View>

              <View style={[styles.iconButtonContainer]}>
                {!locked && playerConfig?.layoutMode === 'advanced' && (
                  <IconTagView
                    ref={iconTagViewRef}
                    style={{ marginHorizontal: 4 }}
                    theme={iconTagViewTheme}
                  />
                )}

                {!locked &&
                  !playerConfig?.disableResizeMode &&
                  playerConfig?.layoutMode === 'intermediate' && (
                    <IconButton onPress={onAspectRatioPress}>
                      <IconAspectRatio size={ICON_SIZE} color={ICON_COLOR} />
                    </IconButton>
                  )}

                {!locked &&
                  !playerConfig?.disableMore &&
                  playerConfig?.layoutMode === 'advanced' && (
                    <IconButton onPress={onMorePress}>
                      <IconMoreHorizontal size={ICON_SIZE} color={ICON_COLOR} />
                    </IconButton>
                  )}
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
);

export default React.memo(HeaderControl);

HeaderControl.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 56,
    minHeight: 56,
    zIndex: 100,
  },
  innerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {},
  titleText: {
    fontSize: 20,
    paddingHorizontal: 10,
    flexShrink: 1,
  },
});
