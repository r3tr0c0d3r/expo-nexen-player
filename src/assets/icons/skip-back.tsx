import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const SkipBack = (props: Props) => {
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
      <Path d="M19 20 9 12l10-8v16zM5 19V5" />
    </Svg>
  );
};

export default SkipBack;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

SkipBack.defaultProps = {
  color: 'black',
  size: '24',
};