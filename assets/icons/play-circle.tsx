import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const PlayCircle = (props: Props) => {
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
      <Path d="m10 8 6 4-6 4V8z" />
    </Svg>
  );
};

export default PlayCircle;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

PlayCircle.defaultProps = {
  color: 'black',
  size: '24',
};
