import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const Sun = (props: Props) => {
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
      <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Svg>
  );
};

export default Sun;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Sun.defaultProps = {
  color: 'black',
  size: '24',
};
