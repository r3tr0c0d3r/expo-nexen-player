import React from 'react';
import { ColorValue } from 'react-native';
import {Line, Svg, SvgProps} from 'react-native-svg';

const Loader = (props: Props) => {
  const {color, size, ...rest} = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}>
      <Line x1="12" y1="2" x2="12" y2="6"></Line>
      <Line x1="12" y1="18" x2="12" y2="22"></Line>
      <Line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></Line>
      <Line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></Line>
      <Line x1="2" y1="12" x2="6" y2="12"></Line>
      <Line x1="18" y1="12" x2="22" y2="12"></Line>
      <Line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></Line>
      <Line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></Line>
    </Svg>
  );
};

export default Loader;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Loader.defaultProps = {
  color: 'black',
  size: '24',
};
