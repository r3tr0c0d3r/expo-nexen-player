import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const Sun2 = (props: Props) => {
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
      <Path d="M12 3h0M12 21h0M5.64 5.64h0M18.36 18.36h0M3 12h0M21 12h0M5.64 18.36h0M18.36 5.64h0" />
    </Svg>
  );
};

export default Sun2;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Sun2.defaultProps = {
  color: 'black',
  size: '24',
};
