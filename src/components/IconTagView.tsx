import React, { useImperativeHandle } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type { TagViewTheme } from '../utils/Theme';

import { IconRepeat, IconSun1, IconVolume, IconZap } from '../assets/icons';

export interface IconTagViewTheme extends TagViewTheme {}

type IconTagViewProps = {
  theme?: IconTagViewTheme;
  style?: StyleProp<ViewStyle>;
};
export type IconTagViewRef = {
  updateState: (newState: IconTagViewState) => void;
};
export type IconTagViewState = {
  volumeIcon?: JSX.Element;
  brightnessIcon?: JSX.Element;
  repeatIcon?: JSX.Element;
  speedIcon?: JSX.Element;
};
const IconTagView = React.forwardRef<IconTagViewRef, IconTagViewProps>(
  (props, ref) => {
    const { theme, style } = props;

    const [state, setState] = React.useState<IconTagViewState>({
      volumeIcon: (
        <IconVolume size={theme?.iconSize} color={theme?.iconColor} />
      ),
      brightnessIcon: (
        <IconSun1 size={theme?.iconSize} color={theme?.iconColor} />
      ),
      repeatIcon: (
        <IconRepeat size={theme?.iconSize} color={theme?.inactiveIconColor} />
      ),
      speedIcon: (
        <IconZap size={theme?.iconSize} color={theme?.inactiveIconColor} />
      ),
    });

    useImperativeHandle(ref, () => ({
      updateState: (newState: IconTagViewState) => {
        setState({ ...state, ...newState });
      },
    }));

    const containerStyle = {
      height: theme?.height,
      borderRadius: theme?.cornerRadius,
      borderWidth: theme?.borderWidth,
      borderColor: theme?.borderColor,
      backgroundColor: theme?.backgroundColor,
    };

    return (
      <View style={[styles.container, containerStyle, style]}>
        <View style={styles.iconContainer}>{state.volumeIcon}</View>
        <View style={styles.iconContainer}>{state.brightnessIcon}</View>
        <View style={styles.iconContainer}>{state.repeatIcon}</View>
        <View style={styles.iconContainer}>{state.speedIcon}</View>
      </View>
    );
  }
);

export default IconTagView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconContainer: {
    paddingHorizontal: 2,
    opacity: 0.8,
  },
});
