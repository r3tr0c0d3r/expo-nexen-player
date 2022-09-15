import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Volume = (props: Props) => {
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
      <Path d="M11 5 6 9H2v6h4l5 4V5z" />
    </Svg>
  );
};

export default Volume;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Volume.defaultProps = {
  color: 'black',
  size: '24',
};