import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Repeat = (props: Props) => {
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
      <Path d="m17 1 4 4-4 4" />
      <Path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
      <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Svg>
  );
};

export default Repeat;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Repeat.defaultProps = {
  color: 'black',
  size: '24',
};
