import React from 'react';
import { ColorValue } from 'react-native';
import {
    IconSun,
    IconSun1,
    IconSun2,
    IconVolume,
    IconVolume1,
    IconVolume2,
    IconVolume3,
  } from '../assets/icons';

export const getVolumeIcon = (
    volume: number,
    maxVolume: number,
    size?: number,
    color?: ColorValue
  ) => {
    
    const percent = volume / maxVolume;
    if (percent >= 0.7) {
      return <IconVolume3 size={size} color={color} />;
    } else if (percent >= 0.4 && percent < 0.7) {
      return <IconVolume2 size={size} color={color} />;
    } else if (percent > 0 && percent < 0.4) {
      return <IconVolume1 size={size} color={color} />;
    } else {
      return <IconVolume size={size} color={color} />;
    }
  };
  
  export const getBrightnessIcon = (
    brightness: number,
    maxBrightness: number,
    size?: number,
    color?: ColorValue
  ) => {
    const percent = brightness / maxBrightness;
    if (percent >= 0.6) {
      return <IconSun size={size} color={color} />;
    } else if (percent >= 0.3) {
      return <IconSun1 size={size} color={color} />;
    } else {
      return <IconSun2 size={size} color={color} />;
    }
  };