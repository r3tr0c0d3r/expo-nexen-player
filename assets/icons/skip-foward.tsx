import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const SkipForward = (props: Props) => {
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
      <Path d="m5 4 10 8-10 8V4zM19 5v14" />
    </Svg>
  );
};

export default SkipForward;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

SkipForward.defaultProps = {
  color: 'black',
  size: '24',
};