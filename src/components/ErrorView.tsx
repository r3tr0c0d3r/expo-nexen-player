import React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { IconXCircle } from '../assets/icons';
import ModalView from './ModalView';
import type { TipViewTheme } from './TipView';

export interface ErrorViewTheme extends TipViewTheme {}
type ErrorViewProps = {
  theme?: ErrorViewTheme;
  style?: StyleProp<ViewStyle>;
  errorText?: string;
};

const ErrorView = (props: ErrorViewProps) => {
  const { errorText, theme, style } = props;
  const errorTextStyle = {
    color: theme?.textColor,
    fontSize: theme?.textSize,
    fontFamily: theme?.font,
  };
  return (
    <ModalView style={[style]}>
      <IconXCircle size={theme?.iconSize} color={theme?.iconColor} />
      <Text style={[styles.text, errorTextStyle]}>{errorText}</Text>
    </ModalView>
  );
};

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
  },
});
