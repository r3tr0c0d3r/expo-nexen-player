import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { ResizeMode } from './NexenPlayer';

type PosterViewProps = {
  posterSource?: string;
  posterResizeMode?: ResizeMode;
};

const PosterView = (props: PosterViewProps) => {
  const { posterSource, posterResizeMode } = props;

  const imageStyle = {
    resizeMode: posterResizeMode,
  };

  return (
    <View style={styles.container}>
      <Image
        style={[styles.image, imageStyle]}
        source={{ uri: posterSource }}
      />
    </View>
  );
};

export default PosterView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a0a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
