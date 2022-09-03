import * as React from 'react';

import { StyleSheet, View, Button, Text } from 'react-native';
import NexenPlayer, { LayoutMode, NexenPlayerRef } from 'expo-nexen-player';
import { data } from './data';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import Font, { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';


export default function App() {
  const [mode, setMode] = React.useState<LayoutMode>('basic');
  const [paused, setPaused] = React.useState(true);
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const [loaded, setLoaded] = React.useState(false);

  const playerRef = React.useRef<NexenPlayerRef>(null);

  // const [fontsLoaded, error] = useFonts({

  //   "Montserrat-Medium": require('../assets/fonts/Montserrat-Medium.ttf'),
  //   "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
  // });

  // const [fontsLoaded, error] = useFonts({
  //   Montserrat_400Regular,
  //   Montserrat_500Medium,
  //   Montserrat_700Bold,
  // });

  /* React.useEffect(() => {
    async function prepare() {
      // await SplashScreen.preventAutoHideAsync();
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Montserrat_400Regular,
          Montserrat_500Medium,
          Montserrat_700Bold,
        });
      } catch {
        // handle error
      } finally {
        setLoaded(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    console.log(`font is not loaded`);
    return null;
  } */

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
  const onPresentFullScreen = () => {
    setFullScreen(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };
  const onDismissFullScreen = () => {
    setFullScreen(false);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const onBackPressed = () => {};

  const onPlay = () => {
    setPaused(false);
  };

  const onPaused = () => {
    setPaused(true);
  };

  React.useEffect(() => {
    playerRef.current?.setPlaylist(data);
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title={`Mode: ${mode}`} onPress={() => {}} />
      </View>
      <NexenPlayer
        ref={playerRef}
        style={styles.player}
        // source={require('../assets/videos/The_Northern_Lights_-_From_Under_Other_Stars.mp4')}
        source={{
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        }}
        // poster={
        //   'https://www.carage.net/media/halfhd/carage_fahrzeuge_square_8.jpg'
        // }
        // posterStyle={'cover'}
        title={'The Northern Lights - From Under Other Stars'}
        layoutMode={mode}
        // disableStop={true}
        // disableSubtitle={true}
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
        // playList={data}
        // playListIndex={-6}
        // pause={paused}
        onPlay={onPlay}
        onPaused={onPaused}
        onBackPressed={onBackPressed}
        onPresentFullScreen={onPresentFullScreen}
        onDismissFullScreen={onDismissFullScreen}
      />

      <Video
        // ref={videoRef}
        style={styles.player}
        source={require('../assets/videos/The_Northern_Lights_-_From_Under_Other_Stars.mp4')}
        useNativeControls={true}
        // posterSource={{
        //   uri: videoList ? videoList![videoIndex!].poster : poster,
        // }}
        // posterStyle={posterStyle}
        // shouldPlay={!paused}
        // isMuted={muted}
        // volume={volume! / 100}
        // isLooping={loop}
        // rate={speed}
        // resizeMode={getKeyByValue(RESIZE_MODE_VALUES[resizeModeIndex]!)}
        // onLoadStart={onLoadStart}
        // onLoad={onLoad}
        // onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        // onError={onError}
        // onReadyForDisplay={onReadyForDisplay}
        // onFullscreenUpdate={onFullscreenUpdate}
      />

      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title={`Change Mode: ${mode}`} />
        <View style={{ marginTop: 8 }} />
        <Button onPress={onPausePress} title={paused ? 'Play' : 'Pause'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#bdd',
  },
  player: {
    width: '100%',
    height: 260,
    // marginVertical: 5,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: 'pink',
    zIndex: 1,
  },
});
