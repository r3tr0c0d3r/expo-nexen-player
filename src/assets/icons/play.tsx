import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Play = (props: Props) => {
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
      <Path d="m5 3 14 9-14 9V3z" />
    </Svg>
  );
};

export default Play;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Play.defaultProps = {
  color: 'black',
  size: '24',
};