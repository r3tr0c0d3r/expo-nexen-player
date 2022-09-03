import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Volume3 = (props: Props) => {
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
      <Path d="M11 5 6 9H2v6h4l5 4V5zM15.07 3.93a8.2 8.2 0 0 1 0 16.14m.47-11.61a4 4 0 0 1 0 7.07" />
    </Svg>
  );
};

export default Volume3;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Volume3.defaultProps = {
  color: 'black',
  size: '24',
};