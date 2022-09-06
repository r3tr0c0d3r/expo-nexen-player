import React from 'react';
import {
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';

const ANIMATION_DURATION = 350;
const USE_NATIVE_DRIVER = false;

export type WrapperComponentRef = {
  show: (callback?: Animated.EndCallback) => void;
  hide: (callback?: Animated.EndCallback) => void;
};

export const withAnimation = <ComposedComponentProps extends object>(
  ComposedComponent: React.ComponentType<ComposedComponentProps>
) => {
  type WrapperComponentProps = ComposedComponentProps & {
    animateFrom: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
    distance: number;
    style?: StyleProp<ViewStyle>;
  };

  const WrapperComponent = React.forwardRef<
    WrapperComponentRef,
    WrapperComponentProps
  >((props, ref) => {
    const {
      animateFrom,
      distance,
      style,
      ...composedComponentProps
    } = props;

    const opacity = React.useRef(new Animated.Value(0)).current;
    const margin = React.useRef(new Animated.Value(-distance)).current;

    const startComponentShowAnimation = (callback?: Animated.EndCallback) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(margin, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start(callback);
    };

    const startComponentHideAnimation = (callback?: Animated.EndCallback) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(margin, {
          toValue: -distance,
          duration: ANIMATION_DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start(callback);
    };

    React.useImperativeHandle(ref, () => ({
      show: (callback?: Animated.EndCallback) => {
        startComponentShowAnimation(callback);
      },
      hide: (callback?: Animated.EndCallback) => {
        startComponentHideAnimation(callback);
      },
    }));

    const wrapperStyle = {
      opacity,
      marginLeft: animateFrom === 'LEFT' ? margin : undefined,
      marginTop: animateFrom === 'TOP' ? margin : undefined,
      marginRight: animateFrom === 'RIGHT' ? margin : undefined,
      marginBottom: animateFrom === 'BOTTOM' ? margin : undefined,
    };

    return (
      <ComposedComponent
        style={[style, wrapperStyle]}
        {...(composedComponentProps as ComposedComponentProps)}
      />
    );
  });

  return WrapperComponent;
};
