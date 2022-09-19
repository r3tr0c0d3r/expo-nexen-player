import React from 'react';
import { ColorValue } from 'react-native';
import {Path, Svg, SvgProps} from 'react-native-svg';

const Single = (props: Props) => {
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
      <Path d="M5 5h14v14H5z" />
    </Svg>
  );
};

export default Single;

interface Props extends SvgProps {
  color?: ColorValue;
  size?: string | number;
}

Single.defaultProps = {
  color: 'black',
  size: '24',
};
