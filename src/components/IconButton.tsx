import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
interface IconButtonProps {
  children: JSX.Element;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const IconButton = ({ children, style, onPress }: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 1,
  },
});
