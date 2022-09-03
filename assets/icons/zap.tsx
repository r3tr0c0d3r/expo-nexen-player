import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Zap = (props: Props) => {
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
      <Path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </Svg>
  );
};

export default Zap;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Zap.defaultProps = {
  color: 'black',
  size: '24',
};
