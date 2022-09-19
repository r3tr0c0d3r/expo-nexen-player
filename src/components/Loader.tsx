import React from 'react';
import {Animated, Easing, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {IconLoader} from '../assets/icons';
import ModalView from './ModalView';
import type { TipViewTheme } from './TipView';

export interface LoaderTheme extends TipViewTheme {

}

type LoaderProps = {
  loaderIcon?: JSX.Element;
  loaderText?: string;
  theme?: LoaderTheme;
  style?: StyleProp<ViewStyle>;
};

const Loader = (props: LoaderProps) => {
  const {theme, style} = props;
  
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const spinAnim = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <ModalView style={style}>
      <Animated.View style={{transform: [{rotate: spinAnim}]}}>
        {props.loaderIcon ? (
          props.loaderIcon
        ) : (
          <IconLoader size={theme?.iconSize} color={theme?.iconColor} />
        )}
      </Animated.View>

      <View>
        <Text style={[styles.text, {color: theme?.textColor, fontSize: theme?.textSize}]}>
          {props.loaderText}
        </Text>
      </View>
    </ModalView>
  );
};

export default React.memo(Loader);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    marginTop: 5,
}
});
