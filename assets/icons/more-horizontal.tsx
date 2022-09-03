import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Svg, SvgProps} from 'react-native-svg';

const MoreHorizontal = (props: Props) => {
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
      <Circle cx={12} cy={12} r={1} />
      <Circle cx={19} cy={12} r={1} />
      <Circle cx={5} cy={12} r={1} />
    </Svg>
  );
};

export default MoreHorizontal;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

MoreHorizontal.defaultProps = {
  color: 'black',
  size: '24',
};
