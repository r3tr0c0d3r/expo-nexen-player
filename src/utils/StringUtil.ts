import { ResizeMode } from "expo-av"

export const formatTime = (seconds: number) => {
    let result: string = ''
    let h = Math.floor(seconds / 3600) < 10 ? Math.floor(seconds / 3600) : Math.floor(seconds / 3600)
    let m = Math.floor((seconds / 60 % 60)) < 10 ? Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60))
    let s = Math.floor((seconds % 60)) < 10 ? '0' + Math.floor((seconds % 60)) : Math.floor((seconds % 60))
    if (Math.floor(seconds / 3600) === 0) {
        result = `${m}:${s}`
    } else {
        result = `${h}:${m}:${s}`
    }

    return result
}

export const getAspectRatioTipText = (text: string) => {
    if (text == null || text.length == 0) {
        return '';
    }

    let tipText = text
    if (tipText.includes('SURFACE_')) {
        tipText = tipText.replace('SURFACE_', '');
        if (tipText == '16_9' || tipText == '4_3') {
            tipText = tipText.replace('_', ':');
        } else {
            tipText = tipText.replace(/_/g, ' ');
        }
    } else {
        tipText = tipText.replace(/_/g, ' ');
    }

    return tipText;
};

export const getTimeTipText = (time: number, totalTime: number) => {
    return `${formatTime(time)}/${formatTime(totalTime)}`
}

const formatTimeTip = (time: number) => {
    let seconds = Math.abs(time)
    let m = Math.floor((seconds / 60 % 60)) < 10 ? Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60))
    let s = Math.floor((seconds % 60)) < 10 ? '0' + Math.floor((seconds % 60)) : Math.floor((seconds % 60))
    return `${m}:${s}`
}

export const getForwardOrRewindTimeTipText = (symbol: string, minTime: number, maxTime: number) => {
    return `${symbol}${formatTimeTip(minTime)} (${formatTimeTip(maxTime)})`
}

export const getForOrRewTimeTipText = (symbol: string, forwardTime: number, time: number) => {
    return `${symbol}${forwardTime}s (${formatTimeTip(time)})`
}

export function getKeyByValue(value: string): ResizeMode {
    var mode: ResizeMode;
    switch (value) {
        case 'contain':
            mode = ResizeMode.CONTAIN;
            break;
        case 'cover':
            mode = ResizeMode.COVER;
            break;
        case 'stretch':
            mode = ResizeMode.STRETCH;
            break;
        default:
            mode = ResizeMode.CONTAIN
    }

    return mode;
}