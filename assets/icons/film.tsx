import React from 'react';
import { ColorValue } from 'react-native';
import { Path, Rect, Svg, SvgProps } from 'react-native-svg';

const Film = (props: Props) => {
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
    <Path d="M7 3v18M17 3v18M2 12h20M2 7.5h5M2 16.5h5M17 16.5h5M17 7.5h5" />
    </Svg>
  );
};

export default Film;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Film.defaultProps = {
  color: 'black',
  size: '24',
};
