import React from 'react'
import { Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native'

type ModalViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
}

const ModalView = (props: ModalViewProps) => {
  const { children, style } = props;

  return (
    <Animated.View style={[styles.container, style]}>
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