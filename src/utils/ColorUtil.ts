/**
 * Taken from https://www.npmjs.com/package/hex-to-rgba.
 */

export const getAlphaColor = (colorCode: string, alpha: number | string) => {
  var color = 'rgba(250,250,250,1.0)';
  if (colorCode) {
    if (colorCode.startsWith('#')) {
      color = hexToRgba(colorCode, alpha)
    } else if (colorCode.startsWith('rgb')) {
      var rgbArray = colorCode.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
      if (rgbArray) {
        var r = Number(rgbArray[1]);
        var g = Number(rgbArray[2]);
        var b = Number(rgbArray[3]);
        var a = Number(rgbArray[4] || 1);
        color = formatRgb({ r, g, b, a }, alpha);
      }
    }
  }
  return color
};

const removeHash = (hex: string) => (hex.charAt(0) === '#' ? hex.slice(1) : hex);

const parseHex = (nakedHex: string) => {
  const isShort = (
    nakedHex.length === 3
    || nakedHex.length === 4
  );

  const twoDigitHexR = isShort ? `${nakedHex.slice(0, 1)}${nakedHex.slice(0, 1)}` : nakedHex.slice(0, 2);
  const twoDigitHexG = isShort ? `${nakedHex.slice(1, 2)}${nakedHex.slice(1, 2)}` : nakedHex.slice(2, 4);
  const twoDigitHexB = isShort ? `${nakedHex.slice(2, 3)}${nakedHex.slice(2, 3)}` : nakedHex.slice(4, 6);
  const twoDigitHexA = ((isShort ? `${nakedHex.slice(3, 4)}${nakedHex.slice(3, 4)}` : nakedHex.slice(6, 8)) || 'ff');

  return {
    r: twoDigitHexR,
    g: twoDigitHexG,
    b: twoDigitHexB,
    a: twoDigitHexA,
  };
};

const hexToDecimal = (hex: string) => parseInt(hex, 16);

const hexesToDecimals = ({
  r, g, b, a,
}: { r: string, g: string, b: string, a: string }) => ({
  r: hexToDecimal(r),
  g: hexToDecimal(g),
  b: hexToDecimal(b),
  a: +((hexToDecimal(a) / 255).toFixed(2)),
});

const isNumeric = (n: number | string) => !isNaN(parseFloat(String(n))) && isFinite(Number(n)); // eslint-disable-line no-restricted-globals, max-len

const formatRgb = (decimalObject: any, parameterA: number | string) => {
  const {
    r, g, b, a: parsedA,
  } = decimalObject;
  const a = isNumeric(parameterA) ? parameterA : parsedA;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const hexToRgba = (hex: string, a: number | string) => {
  const hashlessHex = removeHash(hex);
  const hexObject = parseHex(hashlessHex);
  const decimalObject = hexesToDecimals(hexObject);

  return formatRgb(decimalObject, a);
};