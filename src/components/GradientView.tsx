import React from 'react';
import {
  ColorValue,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type GradientViewProps = {
  width?: number;
  height?: number;
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
  startColor?: ColorValue;
  middleColor?: ColorValue;
  endColor?: ColorValue;
  startOpacity?: number;
  middleOpacity?: number;
  endOpacity?: number;
  startOffset?: number;
  middleOffset?: number;
  endOffset?: number;
  style?: StyleProp<ViewStyle>;
};

const GradientView = (props: GradientViewProps) => {
  const {
    startPoint,
    endPoint,
    startColor,
    middleColor,
    endColor,
    startOpacity,
    middleOpacity,
    endOpacity,
    startOffset,
    middleOffset,
    endOffset,
    style,
  } = props;

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimensions;
    if (w !== width || h !== height) {
      setDimensions({ width, height });
    }
  };

  return (
    <View style={[styles.container, style]} onLayout={onLayoutChange}>
      <Svg width={dimensions.width} height={dimensions.height}>
        <Defs>
          <LinearGradient
            id="gradient"
            x1={startPoint?.x}
            y1={startPoint?.y}
            x2={endPoint?.x}
            y2={endPoint?.y}
          >
            <Stop
              offset={startOffset}
              stopColor={startColor}
              stopOpacity={startOpacity}
            />
            <Stop
              offset={middleOffset}
              stopColor={middleColor}
              stopOpacity={middleOpacity}
            />
            <Stop
              offset={endOffset}
              stopColor={endColor}
              stopOpacity={endOpacity}
            />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          fill="url(#gradient)"
        />
      </Svg>
    </View>
  );
};

export default GradientView;

GradientView.defaultProps = {
  startPoint: { x: 0, y: 0 },
  endPoint: { x: 0, y: 1 },
  startColor: 'black',
  middleColor: 'black',
  endColor: 'black',
  startOpacity: 1,
  middleOpacity: 1,
  endOpacity: 1,
  startOffset: 0,
  middleOffset: 0.5,
  endOffset: 1,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '25%',
  },
});
