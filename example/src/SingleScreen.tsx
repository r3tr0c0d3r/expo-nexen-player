import React, { ReactElement } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Button from './Button';
import NexenPlayer, {
  LayoutMode,
  NexenPlayerRef,
  PlayerConfig,
  PlayerSource,
  PlaylistItem,
} from 'expo-nexen-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation } from '@react-navigation/native';
import { data } from './data';
import { StatusBar } from 'expo-status-bar';
import { IconSingle } from '../assets/icons';
type Props = {};

const { width, height } = Dimensions.get('screen');

const SingleScreen = (props: Props) => {
  // const COLUMNS = width > height ? 3 : 2;
  const COLUMNS = 3;
  const ITEM_SIZE = width / 3;
  const navigation = useNavigation();
  const edgeinsets = useSafeAreaInsets();

  const playerRef = React.useRef<NexenPlayerRef>(null);

  const [paused, setPaused] = React.useState(true);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [playlist, setPlaylist] = React.useState(false);
  const [source, setSource] = React.useState<PlayerSource>({
    // source: {
    //   uri: 'https://bitmovin-a.akamaihd.net/content/sintel/sintel.mpd',
    // },
    source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),

    poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
    title: "Ryu's Hurricane Kick and Hadoken",
  });
  const [config, setConfig] = React.useState<PlayerConfig>({
    // posterResizeMode: 'cover',
    layoutMode: 'basic',
    autoPlay: true,
  });

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

  const onPausePress = () => {
    if (paused) {
      playerRef.current?.play();
    } else {
      playerRef?.current?.pause();
    }
    setPaused((prevState) => !prevState);
  };
  const updateLayoutMode = (mode: LayoutMode) => {
    setConfig((prevState) => {
      return {
        ...prevState,
        layoutMode: mode,
      };
    });
  };

  const onModePress = () => {
    if (config.layoutMode === 'basic') {
      updateLayoutMode('intermediate');
    } else if (config.layoutMode === 'intermediate') {
      updateLayoutMode('advanced');
    } else {
      updateLayoutMode('basic');
    }
  };

  const onToggleFullscreen = () => {
    // playerRef.current?.setPlaylistIndex(9);
    setIsFullScreen((prevState) => !prevState);
  };

  const onReloadPress = () => {
    playerRef.current?.reload();
  };

  const onFullScreenModeUpdate = (fullScreen: boolean) => {
    if (fullScreen) {
      hideTabBar();
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT).then(() => {
      //   console.log(`LANDSCAPE`)
      // });
    } else {
      showTabBar();
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).then(() => {
      //   console.log(`PORTRAIT`)
      // });
    }
    setIsFullScreen(fullScreen);
  };

  const onPlaylistItemSelect = (index: number) => {
    setSource((prevState) => {
      return {
        ...prevState,
        playlist: {
          items: prevState.playlist?.items!,
          currentIndex: index,
        }
      }
    });
  };

  const onBackPressed = () => {};

  const onPlay = () => {
    console.log(`Player: onPlay`);
    setPaused(false);
  };

  const onPaused = () => {
    console.log(`Player: onPaused`);
    setPaused(true);
  };

  const onSkipNext = (index: number) => {
    updateCurrentIndex(index);
  };

  const onSkipBack = (index: number) => {
    updateCurrentIndex(index);
  };

  const onPlaylistSet = () => {
    if (playlist) {
      setSource((prevState) => {
        return {
          ...prevState,
          playlist: undefined,
        };
      });
    } else {
      setSource((prevState) => {
        return {
          ...prevState,
          playlist: {
            items: data,
            currentIndex: 4,
          },
        };
      });
    }
    setPlaylist((prevState) => !prevState);
  };

  const updateCurrentIndex = (index: number) => {
    setSource((prevState) => {
      return {
        ...prevState,
        playlist: {
          items: prevState.playlist?.items!,
          currentIndex: index,
        }
      }
    });
  }

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<PlaylistItem>): ReactElement<any, any> => {
    
    const onItemPress = () => {
      if (index !== source.playlist?.currentIndex) {
        playerRef.current?.load(index, () => {
          updateCurrentIndex(index);
        });
      }
      
      // playerRef.current?.unload(() => {
      //   updateCurrentIndex(index);
      // });
      
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.item, { width: ITEM_SIZE, height: ITEM_SIZE }]}
        onPress={onItemPress}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          source={{ uri: item.poster }}
        />
        {index !== source.playlist?.currentIndex && (
          <View style={styles.iconContainer}>
            <IconSingle size={50} color={'rgba(255,255,255,0.3)'} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
      <StatusBar
        hidden={isFullScreen}
        // translucent={isFullScreen}
        // backgroundColor={'rgba(0,0,0,0)'}
      />
      <View style={[styles.container]}>
        <View style={[viewStyle]}>
          <NexenPlayer
            ref={playerRef}
            style={styles.player}
            playerSource={source}
            playerConfig={config}
            insets={edgeinsets}
            theme={
              {
                // colors: {
                //   primaryIconColor: fullScreen ? 'white' : 'blue',
                // },
                // fonts: {
                //   primaryFont: 'Montserrat-Medium',
                //   secondaryFont: 'Montserrat-Regular',
                // },
              }
            }
            onPlay={onPlay}
            onPause={onPaused}
            onSkipNext={onSkipNext}
            onSkipBack={onSkipBack}
            onBackPress={onBackPressed}
            onFullScreenModeUpdate={onFullScreenModeUpdate}
            onPlaylistItemSelect={onPlaylistItemSelect}
          />
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1 }}
          data={source.playlist?.items}
          renderItem={renderItem}
          numColumns={COLUMNS}
        />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={onModePress}
            title={`Mode: ${config.layoutMode}`}
          />

          <View style={{ width: 8 }} />
          <Button
            style={styles.button}
            onPress={onPlaylistSet}
            title={playlist ? 'Clear Playlist' : 'Set Playlist'}
          />
        </View>
      </View>
    </>
  );
};

export default SingleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    width: '100%',
    height: 260,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
  },
  button: {
    flex: 1,
  },
  item: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  icon: {
    position: 'absolute',
  },
});
