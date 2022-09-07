import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import NexenPlayer, { LayoutMode, NexenPlayerRef } from 'expo-nexen-player';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { data } from './data';
import Button from './Button';

type Props = {};

const Player = (props: Props) => {
  const [mode, setMode] = React.useState<LayoutMode>('basic');
  const [paused, setPaused] = React.useState(true);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [playlist, setPlaylist] = React.useState(false);

  const playerRef = React.useRef<NexenPlayerRef>(null);

  const onPress = () => {
    if (mode === 'basic') {
      setMode('intermediate');
    } else if (mode === 'intermediate') {
      setMode('advanced');
    } else {
      setMode('basic');
    }
  };

  const onPausePress = () => {
    if (paused) {
      playerRef.current?.play();
    } else {
      playerRef?.current?.pause();
    }
    setPaused((prevState) => !prevState);
  };
  const onFullScreenModeUpdate = async (fullScreen: boolean) => {
    console.log(`Player: onFullScreenModeUpdate:${fullScreen}`)
    if (fullScreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    setIsFullScreen(fullScreen);
  };

  const onBackPressed = () => {};

  const onPlay = () => {
    setPaused(false);
  };

  const onPaused = () => {
    setPaused(true);
  };

  const onChangeIndexPress = () => {
    playerRef.current?.setActiveIndex(9);
  };
  const onReloadPress = () => {
    playerRef.current?.reload();
  };

  const onPlaylistSet = () => {
    if (playlist) {
      playerRef.current?.setPlaylist([]);
    } else {
      playerRef.current?.setPlaylist(data, 4);
    }
    setPlaylist((prevState) => !prevState);
  };

  React.useEffect(() => {
    // playerRef.current?.setPlaylist(data, 4);
    // playerRef.current?.setActiveIndex(4);
  }, []);

  const edge = useSafeAreaInsets();
  console.log(`PlayerEdgeInsets: ${JSON.stringify(edge)}`);

  const viewStyle: StyleProp<ViewStyle> = isFullScreen
    ? {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 9999,
      }
    : { position: 'relative' };

  return (
    <>
      <StatusBar style={'light'} hidden={isFullScreen} />
      <View style={[styles.container, viewStyle]}>
        <NexenPlayer
          ref={playerRef}
          style={styles.player}
          source={require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4')}
          // source={{
          //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
          // }}
          // poster={
          //   'https://www.carage.net/media/halfhd/carage_fahrzeuge_square_8.jpg'
          // }
          // posterStyle={'cover'}
          title={"Ryu's Hurricane Kick and Hadoken"}
          layoutMode={mode}
          // controlHideMode={'auto'}
          // disableStop={true}
          // disableSubtitle={true}
          insets={edge}
          theme={
            {
              // colors: {
              //   primaryIconColor: fullScreen ? 'white' : 'blue',
              // },
              // fonts: {
              //   primaryFont: 'Montserrat-Medium',
              //   secondaryFont: 'Montserrat-Regular',
              // }
            }
          }
          // pause={paused}
          onPlay={onPlay}
          onPause={onPaused}
          onBackPressed={onBackPressed}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={onPress} title={`Change Mode: ${mode}`} />
          <View style={{ marginTop: 8 }} />
          <Button onPress={onPausePress} title={paused ? 'Play' : 'Pause'} />
          {/* <View style={{ marginTop: 8 }} />
        <Button onPress={onChangeIndexPress} title={'Change Index to 9'} /> */}
          <View style={{ marginTop: 8 }} />
          <Button onPress={onReloadPress} title={'Reload'} />
          <View style={{ marginTop: 8 }} />
          <Button
            onPress={onPlaylistSet}
            title={playlist ? 'Clear Playlist' : 'Set Playlist'}
          />
          {/* <View style={{ marginTop: 8 }} />
        <Button onPress={onPlaylistSetEmpty} title={'Set Empty Playlist'} /> */}
        </View>
      </View>
    </>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // paddingVertical: 100,
    // justifyContent: 'center',
    // backgroundColor: '#bdd',
  },
  player: {
    width: '100%',
    height: 260,
    // marginVertical: 5,
  },
  buttonContainer: {
    width: 240,
    paddingVertical: 10,
    zIndex: 1,
  },
});
