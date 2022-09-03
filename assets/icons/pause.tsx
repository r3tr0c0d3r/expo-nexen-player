import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Pause = (props: Props) => {
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
      <Path d="M4.25 4.25h4.5v15.5h-4.5zM15.25 4.25h4.5v15.5h-4.5z" />
    </Svg>
  );
};

export default Pause;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Pause.defaultProps = {
  color: 'black',
  size: '24',
};