import type { ColorValue } from "react-native";

export interface NexenTheme {
    trackSeekBar?: TrackSeekBarTheme;
    speedSeekBar?: SpeedSeekBarTheme;
    volumeSeekBar?: VerticalSeekBarTheme;
    brightnessSeekBar?: VerticalSeekBarTheme;
    lineSeekBar?: LineBarTheme;
    miniSeekBar?: MiniSeekBarTheme;
    lockButton?: LockButtonTheme;
    tagView?: TagViewTheme;
    tipView?: TipViewTheme;
    colors?: ColorTheme;
    icons?: {};
    fonts?: FontTheme;
    sizes?: SizeTheme;
}

export type ColorTheme = {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    modalBackgroundColor?: string;
    primaryTextColor?: string;
    secondaryTextColor?: string;
    primaryIconColor?: string;
    secondaryIconColor?: string;
    // inactiveIconColor?: string;
    // activeIconColor?: string;

    // tipViewIconColor?: string;
    // tipViewTextColor?: string;
    rippleIconColor?: string;
}

export const DefaultColorsTheme: ColorTheme = {
    primaryColor: '#0a0a0a',
    secondaryColor: '#fafafa',
    accentColor: '#fa5005',
    // modalBackgroundColor: 'rgb(10,10,10,0.7)',
    primaryTextColor: '#fafafa',
    secondaryTextColor: '#e6e6e6',
    primaryIconColor: '#fafafa',
    secondaryIconColor: '#e6e6e6',
    // inactiveIconColor: '#515151',
    // activeIconColor: '#fa5005',

    // tipViewIconColor?: number;
    // tipViewTextColor?: number;
    rippleIconColor: '#e6e6e6',
}

export type FontTheme = {
    primaryFont?: string;
    secondaryFont?: string;
}

export type SizeTheme = {
    modalCornerRadius?: number;
    primaryTextSize?: number;
    secondaryTextSize?: number;
    primaryIconSize?: number;
    secondaryIconSize?: number;

    // tagViewHeight?: number;
    // tagViewBorderWidth?: number;
    // tagViewCornerRadius?: number;
    // tagViewTextSize?: number;
    // tagViewTextLineHeight?: number;

    // tipViewIconSize?: number;
    // tipViewTextSize?: number;

    // trackSeekBarThumbCornerRadius?: number;
    // trackSeekBarThumbBorderCornerRadius?: number;
    // lockButtonTextSize?: number;
    // lockButtonThumbWidth?: number;
    // lockButtonCornerRadius?: number;
    rippleIconSize?: number;
    paddingVertical?: number;
    paddingHorizontal?: number;
}

export const DefaultSizesTheme: SizeTheme = {
    modalCornerRadius: 12,
    primaryTextSize: 20,
    secondaryTextSize: 15,
    primaryIconSize: 20,
    secondaryIconSize: 20,

    // tagViewHeight: 18,
    // tagViewBorderWidth: 1,
    // tagViewCornerRadius: 9,
    // tagViewTextSize: 12,
    // tagViewTextLineHeight: 14,

    // tipViewIconSize: 20,
    // tipViewTextSize: 18,

    // trackSeekBarThumbCornerRadius: 4,
    // trackSeekBarThumbBorderCornerRadius: 5,
    // slideButtonFontSize: 14,
    // slideButtonThumbWidth: 40,
    // slideButtonCornerRadius: 10,
    rippleIconSize: 28,
    paddingVertical: 8,
    paddingHorizontal: 0,
}

export interface TrackSeekBarTheme {
    trackColor?: ColorValue;
    cachedTrackColor?: ColorValue;
    totalTrackColor?: ColorValue;
    thumbColor?: ColorValue;
    thumbBorderColor?: ColorValue;

    trackHeight?: number;
    thumbSize?: number;
    thumbBorderWidth?: number;
    thumbCornerRadius?: number;
    thumbBorderCornerRadius?: number;
}

export const DefaultTrackSeekBarTheme: TrackSeekBarTheme = {
    // trackColor: '#fa5005',
    // cachedTrackColor: '#fafafa',
    // totalTrackColor: 'rgba(250,250,250,0.3)',
    // thumbColor: '#fa5005',
    // thumbBorderColor: 'rgba(250,250,250,0.7)',

    trackHeight: 2,
    thumbSize: 10,
    thumbBorderWidth: 5,
    thumbCornerRadius: 5,
    thumbBorderCornerRadius: 7.5,
}

export type SpeedSeekBarTheme = {
    lineColor?: ColorValue;
    dotColor?: ColorValue;
    thumbColor?: ColorValue;
    textColor?: ColorValue;

    textSize?: number;
    lineHeight?: number;
    dotSize?: number;
    dotCornerRadius?: number;
    thumbSize?: number;
    thumbCornerRadius?: number;
}

export const DefaultSpeedSeekBar: SpeedSeekBarTheme = {
    // lineColor: 'rgba(250,80,5,0.6)',
    // dotColor: '#fafafa',
    // thumbColor: '#fafafa',
    // textColor: '#fafafa'
    textSize: 12,
    lineHeight: 2,
    dotSize: 6,
    dotCornerRadius: 3,
    thumbSize: 16,
    thumbCornerRadius: 8,
}

export interface LineBarTheme {
    lineColor?: ColorValue;
    lineUnderlayColor?: ColorValue;
}

export interface VerticalSeekBarTheme {
    barColor?: ColorValue;
    underlayColor?: ColorValue;
}

export const DefaultVolumeSeekBarTheme: VerticalSeekBarTheme = {
    barColor: 'rgba(250,250,250,0.5)',
    underlayColor: 'rgba(10,10,10,0.3)',
    // containerColor: 'rgba(10,10,10,0.7)',
}

export const DefaultBrightnessSeekBarTheme: VerticalSeekBarTheme = {
    barColor: 'rgba(250,250,250,0.5)',
    underlayColor: 'rgba(10,10,10,0.3)',
    // containerColor: 'rgba(10,10,10,0.7)',
}

export interface MiniSeekBarTheme {
    barColor?: ColorValue;
    underlayColor?: ColorValue;
    thumbColor?: ColorValue;

    trackHeight?: number,
    thumbSize?: number,
    thumbCornerRadius?: number,
}

export const DefaultMiniSeekBarTheme: MiniSeekBarTheme = {
    barColor: 'rgba(250,80,5,0.6)',
    underlayColor: 'rgba(10,10,10,0.3)',
    thumbColor: '#fafafa',

    trackHeight: 2,
    thumbSize: 10,
    thumbCornerRadius: 5,
}

export interface LockButtonTheme {
    containerColor?: ColorValue;
    underlayColor?: ColorValue;
    thumbColor?: ColorValue;
    thumbIconColor?: ColorValue;
    textColor?: ColorValue;
    
    textSize?: number;
    thumbIconSize?: number;
    thumbWidth?: number;
    thumbHeight?: number;
    thumbCornerRadius?: number;
};

export const DefaultLockButtonTheme: LockButtonTheme = {
    // containerColor: 'rgba(10,10,10,0.7)',
    // underlayColor: 'rgba(250,250,250,0.15)',
    // thumbColor: '#fafafa',
    // thumbIconColor: '#fa5005',
    // textColor: '#fafafa',

    textSize: 14,
    thumbIconSize: 18,
    thumbHeight: 36,
    thumbWidth: 36,
    thumbCornerRadius: 18,
}

export type TagViewTheme = {
    height?: number;
    borderWidth?: number;
    cornerRadius?: number;
    textSize?: number;
    textLineHeight?: number;
    iconSize?: number;
    iconColor?: ColorValue;
    textColor?: ColorValue;
    borderColor?: ColorValue;
    inactiveIconColor?: ColorValue;
    activeIconColor?: ColorValue;
}

export const DefaultTagViewTheme: TagViewTheme = {
    height: 18,
    borderWidth: 1,
    cornerRadius: 9,
    textSize: 12,
    textLineHeight: 14,
    iconSize: 12,
    // iconColor: '#e6e6e6',
    // textColor: '#e6e6e6',
    // borderColor: 'rgba(250,250,250,0.3)',
    // inactiveIconColor: '#515151',
    // activeIconColor: '#fa5005',
}

export type TipViewTheme = {
    iconSize?: number;
    textSize?: number;
    iconColor?: ColorValue;
    textColor?: ColorValue;
}

export const DefaultTipViewTheme: TipViewTheme = {
    iconSize: 20,
    textSize: 18,
}

export const DefaultTheme: NexenTheme = {
    trackSeekBar: {
        ...DefaultTrackSeekBarTheme
    },
    speedSeekBar: {
        ...DefaultSpeedSeekBar
    },
    miniSeekBar: {
        ...DefaultMiniSeekBarTheme
    },
    lockButton: {
        ...DefaultLockButtonTheme
    },
    tipView: {
        ...DefaultTipViewTheme
    },
    tagView: {
        ...DefaultTagViewTheme
    },
    colors: {
        ...DefaultColorsTheme
    },
    icons: {

    },
    fonts: {
        
    },
    sizes: {
        ...DefaultSizesTheme
    }

}

