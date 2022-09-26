import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { TagViewTheme } from '../utils/Theme';

export interface TimeTagViewTheme extends TagViewTheme {
  font?: string;
}
type TimeTagViewProps = {
  timeText: string;
  theme?: TimeTagViewTheme;
  style?: StyleProp<ViewStyle>;
};

const TimeTagView = (props: TimeTagViewProps) => {
  const { timeText, theme, style } = props;

  const textContainerStyle = {
    height: theme?.height,
    borderRadius: theme?.cornerRadius,
    borderWidth: theme?.borderWidth,
    borderColor: theme?.borderColor,
    backgroundColor: theme?.backgroundColor,
  };
  const timeTextStyle = {
    fontSize: theme?.textSize,
    lineHeight: theme?.textLineHeight,
    color: theme?.textColor,
    fontFamily: theme?.font,
  };

  return (
    <View style={[styles.container, style, textContainerStyle]}>
      <Text style={[styles.text, timeTextStyle]}>{timeText}</Text>
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
