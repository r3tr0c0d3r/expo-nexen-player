import React from 'react';
import { ColorValue } from 'react-native';
import { Path, Rect, Svg, SvgProps } from 'react-native-svg';

const AspectRatio = (props: Props) => {
  const { color, size, ...rest } = props;
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
      {...rest}
    >
      <Rect x={2} y={3} width={20} height={18} rx={2} ry={2} />
      <Path d="M2 7h20M2 17h20" />
    </Svg>
  );
};

export default AspectRatio;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

AspectRatio.defaultProps = {
  color: 'black',
  size: '24',
};
