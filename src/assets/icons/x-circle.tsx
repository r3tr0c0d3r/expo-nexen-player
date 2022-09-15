import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const XCircle = (props: Props) => {
  const {color, size, ...rest} = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}>
      <Circle cx={12} cy={12} r={10} />
      <Path d="m15 9-6 6M9 9l6 6" />
    </Svg>
  );
};

export default XCircle;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

XCircle.defaultProps = {
  color: 'black',
  size: '24',
};
