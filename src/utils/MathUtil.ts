import { I18nManager } from "react-native";

export const clamp = (value: number, lowerBound: number, upperBound: number) => {
    return Math.min(Math.max(lowerBound, value), upperBound);
};

export const trackToSeekValue = (trackValue: number, totalTrackValue: number, seekWidth: number) => {
    const value =  (trackValue / totalTrackValue) * seekWidth;
    if (isNaN(value)) {
      return 0;
    }
    return value;
};

export const seekToTrackValue = (seekValue: number, totalTrackValue: number, seekWidth: number) => {
    const value = (seekValue / seekWidth) * totalTrackValue;
    if (isNaN(value)) {
      return 0;
    }
    return Math.round(value);
};

export const originalToSeekValue = (originalValue: number, maxValue: number, seekHeight: number) => {
  const value =  (originalValue / maxValue) * seekHeight;
  if (isNaN(value)) {
    return 0;
  }
  return Math.round(value);
};

export const seekToOriginalValue = (seekValue: number, maxValue: number, seekHeight: number) => {
  const value = (seekValue / seekHeight) * maxValue;
  if (isNaN(value)) {
    return 0;
  }
  return Math.round(value);
};

export const boundPosition = (position: number, seekWidth: number) : number => {
    const isRTL = I18nManager.isRTL;
    if (isRTL) {
      return clamp(position, seekWidth, 0);
    } else {
      return clamp(position, 0, seekWidth);
    }
  };


