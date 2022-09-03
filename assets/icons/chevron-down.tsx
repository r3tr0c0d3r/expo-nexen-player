import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const ChevronDown = (props: Props) => {
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
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
};

export default ChevronDown;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

ChevronDown.defaultProps = {
  color: 'black',
  size: '24',
};