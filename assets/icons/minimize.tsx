import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Minimize = (props: Props) => {
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
      <Path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </Svg>
  );
};

export default Minimize;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Minimize.defaultProps = {
  color: 'black',
  size: '24',
};