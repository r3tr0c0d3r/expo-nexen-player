import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { NexenTheme, TagViewTheme } from '../utils/Theme';

export interface TimeTagViewTheme extends TagViewTheme {
  font?: string;
}
type TimeTagViewProps = {
  timeText: string;
  // fullScreen: boolean;
  // disableLargeMode?: boolean;
  theme?: TimeTagViewTheme;
  style?: StyleProp<ViewStyle>;
};

const TimeTagView = (props: TimeTagViewProps) => {
  const { timeText, theme, style } = props;

  // const TEXT_CONTAINER_HEIGHT = nexenTheme?.tagView?.height;
  // const TEXT_CONTAINER_BORDER_RADIUS = nexenTheme?.tagView?.cornerRadius
  // const TEXT_CONTAINER_BORDER_WIDTH = nexenTheme?.tagView?.borderWidth;
  // const TEXT_FONT_SIZE = nexenTheme?.tagView?.textSize;
  // const TEXT_LINE_HEIGHT = nexenTheme?.tagView?.textLineHeight;
  // const TEXT_MARGIN = fullScreen ? 8 : 6;

  // const {
  //   tagViewHeight: TEXT_CONTAINER_HEIGHT,
  //   tagViewCornerRadius: TEXT_CONTAINER_BORDER_RADIUS,
  //   tagViewBorderWidth: TEXT_CONTAINER_BORDER_WIDTH,
  //   tagViewTextSize: TEXT_FONT_SIZE,
  //   tagViewTextLineHeight: TEXT_LINE_HEIGHT,

  // } = useNexenSize(fullScreen, disableLargeMode!, nexenTheme!);

  const textContainerStyle = {
    height: theme?.height,
    borderRadius: theme?.cornerRadius,
    borderWidth: theme?.borderWidth,
    borderColor: theme?.borderColor,
  };
  const timeTextStyle = {
    fontSize: theme?.textSize,
    lineHeight: theme?.textLineHeight,
    color: theme?.textColor,
    fontFamily: theme?.font,
  };

  return (
    <View style={[styles.container, style, textContainerStyle]}>
      <Text style={[styles.text, timeTextStyle]}>
        {timeText}
      </Text>
    </View>
  );
};

export default TimeTagView;

const styles = StyleSheet.create({
  container: {
    minWidth: 40,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    fontSize: 11,
    marginHorizontal: 6,
    lineHeight: 13,
    opacity: 0.8,
  },
});
