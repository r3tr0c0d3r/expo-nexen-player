import React from 'react';
import { ColorValue } from 'react-native';
import {Circle, Path, Svg, SvgProps} from 'react-native-svg';

const Info = (props: Props) => {
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
      <Circle cx={12} cy={12} r={10} />
      <Path d="M12 16v-4M12 8h.01" />
    </Svg>
  );
};

export default Info;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Info.defaultProps = {
  color: 'black',
  size: '24',
};
