import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Rect, Svg, SvgProps} from 'react-native-svg';

const Unlock = (props: Props) => {
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
      <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <Path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </Svg>
  );
};

export default Unlock;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Unlock.defaultProps = {
  color: 'black',
  size: '24',
};
