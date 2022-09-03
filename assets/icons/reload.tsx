import React from 'react';
import { ColorValue } from 'react-native';
import { Path, Svg, SvgProps } from 'react-native-svg';

const Reload = (props: Props) => {
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
      <Path d="M23 4v6h-6" />
      <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </Svg>
  );
};

export default Reload;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Reload.defaultProps = {
  color: 'black',
  size: '24',
};
