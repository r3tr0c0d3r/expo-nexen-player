import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface Props {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: Event) => void;
}

const Button = (props: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(Button);

const styles = StyleSheet.create({
  container: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#212121',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#ececec',
  },
});
