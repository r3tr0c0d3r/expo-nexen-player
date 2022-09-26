import React, { useImperativeHandle } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const RIPPLE_ANIM_DURATION = 500;
const BLINK_ANIM_DURATION = 200;

export interface RippleViewTheme {}

type RippleViewProps = {
  children: JSX.Element;
  rippleSize?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rippleStyle?: StyleProp<ViewStyle>;
};

export type RippleEvent = { x: number; y: number };
export type RippleViewRef = {
  onPress: (newTipText?: string, callback?: () => void) => void;
};

const RippleView = React.forwardRef<RippleViewRef, RippleViewProps>(
  (props, ref) => {
    const { style, containerStyle, rippleStyle, rippleSize, children } = props;
    const [tipText, setTipText] = React.useState('');

    const rippleOpacity = React.useRef(new Animated.Value(0)).current;
    const rippleScale = React.useRef(new Animated.Value(0)).current;
    const blinkViewOpacity = React.useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      onPress: (newTipText?: string, callback?: () => void) => {
        startRippleAnimation(() => {
          callback?.();
        });
        startBlinkAnimation();
        if (newTipText) {
          setTipText(newTipText);
        }
      },
    }));
    const startRippleAnimation = (callback?: () => void) => {
      Animated.parallel([
        Animated.timing(rippleOpacity, {
          toValue: 0.7,
          duration: RIPPLE_ANIM_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(rippleScale, {
          toValue: 1.2,
          duration: RIPPLE_ANIM_DURATION,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            rippleScale.setValue(0);
            callback?.();
          });
        }
      });
    };

    const startBlinkAnimation = (callback?: () => void) => {
      const animSequence = Animated.sequence([
        Animated.timing(blinkViewOpacity, {
          toValue: 0.8,
          duration: BLINK_ANIM_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkViewOpacity, {
          toValue: 0,
          duration: BLINK_ANIM_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]);
      let animation = Animated.loop(animSequence, { iterations: 2 });
      animation.start(() => {
        callback?.();
      });
    };

    return (
      <View style={[styles.container, style]} pointerEvents="none">
        <Animated.View
          style={[
            styles.ripple,
            {
              width: rippleSize! * 2,
              height: rippleSize! * 2,
              borderRadius: rippleSize!,
            },
            rippleStyle,
            {
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />
        <View style={[styles.innerContainer, containerStyle]}>
          <View style={{ flex: 0.45 }} />
          <View style={{ flex: 0.55 }}>
            <Animated.View
              style={[styles.flashContainer, { opacity: blinkViewOpacity }]}
            >
              {children}
            </Animated.View>
            <Animated.Text style={[styles.text, { opacity: blinkViewOpacity }]}>
              {tipText}
            </Animated.Text>
          </View>
        </View>
      </View>
    );
  }
);

export default RippleView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    backgroundColor: 'rgba(250,250,250,0.3)',
  },
  flashContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    margin: 6,
    textAlign: 'center',
  },
});
