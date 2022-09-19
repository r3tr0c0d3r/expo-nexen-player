import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NexenPlayer from 'expo-nexen-player';
import { StatusBar } from 'expo-status-bar';

type Props = {}

const ScrollViewScreen = (props: Props) => {

    const navigation = useNavigation();
  const edgeinsets = useSafeAreaInsets();
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !isFullScreen });
  }, [navigation, isFullScreen]);

  const hideTabBar = () => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  };
  const showTabBar = () => {
    navigation.setOptions({
      tabBarStyle: { display: 'flex' },
    });
  };

  const onFullScreenModeUpdate = async (fullScreen: boolean, index?: number) => {
    console.log(`Player: onFullScreenModeUpdate:${fullScreen}`);
    if (fullScreen) {
        hideTabBar();
      // Orientation.lockToLandscape();
    } else {
        showTabBar();
      // Orientation.lockToPortrait();
    }
    setIsFullScreen(fullScreen);
  };

  return (
    <>
    <StatusBar hidden={isFullScreen} />
    <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={isFullScreen ? false : true}
        contentContainerStyle={{
          flex: isFullScreen ? 1 : 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NexenPlayer
          style={styles.player}
          playerSource={{
            source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
            poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
            title: "Ryu's Hurricane Kick and Hadoken 1",
          }}
          insets={edgeinsets}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
        <NexenPlayer
          style={styles.player}
          playerSource={{
            source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
            poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
            title: "Ryu's Hurricane Kick and Hadoken 2",
          }}
          insets={edgeinsets}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
        <NexenPlayer
          style={styles.player}
          playerSource={{
            source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
            poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
            title: "Ryu's Hurricane Kick and Hadoken 3",
          }}
          insets={edgeinsets}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
        <NexenPlayer
          style={styles.player}
          playerSource={{
            source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
            poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
            title: "Ryu's Hurricane Kick and Hadoken 4",
          }}
          insets={edgeinsets}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
        <NexenPlayer
          style={styles.player}
          playerSource={{
            source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
            poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
            title: "Ryu's Hurricane Kick and Hadoken 5",
          }}
          insets={edgeinsets}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
      </ScrollView>
    </>
  )
}

export default ScrollViewScreen

const styles = StyleSheet.create({
    player: {
        width: '100%',
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'pink',
      },
})