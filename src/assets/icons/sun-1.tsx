import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const Sun1 = (props: Props) => {
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
      <Circle cx={12} cy={12} r={5} />
      <Path d="M12 2v1M12 21v1M4.93 4.93l.71.71M18.36 18.36l.71.71M2 12h1M21 12h1M5.64 18.36l-.71.71M18.36 5.64l.71-.71" />
    </Svg>
  );
};

export default Sun1;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Sun1.defaultProps = {
  color: 'black',
  size: '24',
};
