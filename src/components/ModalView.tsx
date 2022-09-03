import React from 'react'
import { View, Text, Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native'

type ModalViewProps = {
  children: JSX.Element;
  opacity?: Animated.Value;
  marginLeft?: Animated.Value;
  marginRight?: Animated.Value;
  marginTop?: Animated.Value;
  marginBottom?: Animated.Value;
  style?: StyleProp<ViewStyle> | undefined;
}

const ModalView = (props: ModalViewProps) => {
  const {children, style, opacity, marginLeft, marginTop, marginRight, marginBottom} = props;

  const containerStyle = {
    opacity, 
    marginLeft,
    marginTop,
    marginRight, 
    marginBottom,
  }

  return (
    <Animated.View style={[styles.container, style, containerStyle]}>
      {children}
    </Animated.View>
  )
}

export default ModalView

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});