import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const FastForward = (props: Props) => {
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
      <Path d="m13 19 9-7-9-7v14zM2 19l9-7-9-7v14z" />
    </Svg>
  );
};

export default FastForward;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

FastForward.defaultProps = {
  color: 'black',
  size: '24',
};