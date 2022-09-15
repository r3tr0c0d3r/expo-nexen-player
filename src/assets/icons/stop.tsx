import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Stop = (props: Props) => {
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
      <Path d="M4.25 4.25h15.5v15.5H4.25z" />
    </Svg>
  );
};

export default Stop;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Stop.defaultProps = {
  color: 'black',
  size: '24',
};