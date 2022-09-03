import React, {useImperativeHandle} from 'react';
import {
  Animated,
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import type { VerticalSeekBarTheme } from '../utils/Theme';

import ModalView from './ModalView';
import type { TipViewTheme } from './TipView';


export interface SeekBarTipViewTheme extends VerticalSeekBarTheme, TipViewTheme {
  // containerColor?: ColorValue;
  // containerBorderRadius?: number;
  // textColor?: ColorValue;
  // textSize?: number;
}

type SeekBarTipViewProps = {
  dimensions: {width: number; height: number};
  barHeight: Animated.Value;
  heightPercentage: number;
  icon: JSX.Element;
  theme?: SeekBarTipViewTheme;
  parentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};
export type SeekBarTipViewRef = {
  updateState: (newState: SeekBarTipViewState) => void;
};
type SeekBarTipViewState = {
  showTip?: boolean;
  tipText?: string;
  autoHide?: boolean;
  icon?: JSX.Element;
};
const SeekBarTipView = React.forwardRef<SeekBarTipViewRef, SeekBarTipViewProps>((props, ref) => {
  // console.log(`SeekBarTipView: renders`)
  const {dimensions, barHeight, heightPercentage, icon, parentStyle, style, theme} = props;
  React.useEffect(() => {
    console.log(`SeekBarTipView theme:: ${JSON.stringify(theme)}`);
  }, [])

  const [state, setState] = React.useState<SeekBarTipViewState>({
    showTip: false,
    tipText: '',
    autoHide: false,
    icon,
  });

  const timer = React.useRef<NodeJS.Timeout>();

  useImperativeHandle(ref, () => ({
    updateState: (newState: SeekBarTipViewState) => {
      setState({...state, ...newState});
    },
  }));

  const textStyle = {
    color: theme?.textColor,
    fontSize: theme?.textSize,
    fontFamily: theme?.font,
  }

  const seekBarStyle = {
    backgroundColor: theme?.barColor,
    height: barHeight,
  }

  const seekBarUnderlayStyle = {
    backgroundColor: theme?.underlayColor,
    height: dimensions.height * heightPercentage,
  }

  React.useEffect(() => {
    if (state.autoHide) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      if (state.showTip) {
        timer.current = setTimeout(() => {
          setState({...state, showTip: false, tipText: ''});
        }, 1200);
      }
    }
  }, [state]);

  return (
    <>
      {state.showTip && (
        <View style={[styles.parent, parentStyle]}>
          <ModalView style={[styles.container, style]}>
            <>
            <Text style={[styles.text, textStyle]}>{state.tipText}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.seekBarUnderlay,
                  seekBarUnderlayStyle,
                ]}>
                <Animated.View
                  style={[styles.seekBar, seekBarStyle]}
                />
              </View>
            </View>
            <View style={styles.iconContainer}>{state.icon}</View>
            </>
          </ModalView>
        </View>
      )}
    </>
  );
});

export default SeekBarTipView;

const styles = StyleSheet.create({
  parent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    // position: 'absolute',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: DefaultTheme.common?.containerColor,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  barContainer: {
    paddingVertical: 4,

    justifyContent: 'center',
    alignItems: 'center',
  },
  seekBar: {
    position: 'absolute',
    width: 6,
    height: 60,

    // backgroundColor: DefaultTheme.volumeSeekBar?.barColor,
  },
  seekBarUnderlay: {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    width: 6,
    height: 100,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(10, 10, 10, 0.3)',
    // backgroundColor: DefaultTheme.volumeSeekBar?.barUnderlayColor,
  },
  text: {
    minWidth: 35,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    // color: DefaultTheme.common?.primaryTextColor,
    opacity: 0.8,
  },
  iconContainer: {
    paddingHorizontal: 4,
    // paddingVertical: 5,
    opacity: 0.8,
  },
});
