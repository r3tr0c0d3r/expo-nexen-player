import React, {useImperativeHandle} from 'react';
import {ColorValue, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {IconInfo} from './../../assets/icons';
import ModalView from './ModalView';

export interface TipViewTheme {
  iconSize?: number;
  iconColor?: ColorValue;
  textSize?: number;
  textColor?: ColorValue;
  font?: string;
}

type TipViewProps = {
  // children?: React.ReactNode;
  theme?: TipViewTheme;
  style?: StyleProp<ViewStyle>;
};

type TipViewState = {
  showTip?: boolean;
  tipText?: string;
  autoHide?: boolean;
  withIcon?: boolean;
  icon?: JSX.Element;
};
export type TipViewRef = {
  updateState: (newState: TipViewState) => void;
  // updateText: (text: string) => void;
};

const TipView = React.forwardRef<TipViewRef, TipViewProps>((props, ref) => {
  const {style, theme} = props;

  const [state, setState] = React.useState<TipViewState>({
    showTip: false,
    tipText: 'Tip Text',
    autoHide: true,
    withIcon: false,
    icon: <IconInfo size={20} color={'#fafafa'}/>,
  });
  const timeoutRef = React.useRef<NodeJS.Timeout | null>();

  useImperativeHandle(ref, () => ({
    updateState: (newState: TipViewState) => {
      setState({...state, ...newState});
    },
    // updateText: (text: string) => {
    //   setNativeProps({text})
    // },
  }));

  const textStyle = {
    color: theme?.textColor,
    fontSize: theme?.textSize,
    fontFamily: theme?.font,
  }

  React.useEffect(() => {
    // console.log(`VideoScaleTip:useEffect: ${JSON.stringify(state)}`);
    if (state.autoHide) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (state.showTip) {
        timeoutRef.current = setTimeout(() => {
          setState({...state, showTip: false, withIcon: false});
        }, 1200);
      }
    }
  }, [state]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [])

  return (
    <>
      {state.showTip && (
        <ModalView style={[styles.container, style]}>
          <>
          {state.withIcon && (
            <View style={styles.iconContainer}>{state.icon}</View>
          )}
          <Text style={[styles.text, textStyle]}>
            {state.tipText}
          </Text>
          </>
        </ModalView>
      )}
    </>
  );
});

export default TipView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 20,
    // fontWeight: 'bold',
    // color: DefaultTheme.common?.primaryTextColor,
  },
});
