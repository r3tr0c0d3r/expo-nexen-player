import { useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import NexenPlayer, {
  IconButton,
  NexenPlayerRef,
  OptimizationConfig,
  PlayerConfig,
  PlayerSource,
  PlaylistItem,
} from 'expo-nexen-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { data } from './data';
import { IconFlatList } from '../assets/icons';
import { StatusBar } from 'expo-status-bar';
// const { width, height } = Dimensions.get('window');
const { width, height } = Dimensions.get('screen');

type Props = {};
const FlatlistScreen = (props: Props) => {
  // console.log(`FlatlistScreen :: width: ${width} height: ${height}`);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
  const navigation = useNavigation();
  const edgeinsets = useSafeAreaInsets();
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  // const [fullScreenIndex, setFullScreenIndex] = React.useState(-1);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const fullScreenIndex = React.useRef(-1);
  const quiteIndex = React.useRef(0);
  // const [config, setConfig] = React.useState<OptimizationConfig>({
  //   index: -1,
  //   activeIndex: -1,
  //   optimize: true,
  // });
  // const [source, setSource] = React.useState<PlayerSource>({
  //   source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
  //   poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
  //   title: "Ryu's Hurricane Kick and Hadoken",
  //   playlist: {
  //     items: data,
  //     currentIndex: -1,
  //   },
  // });
  const [config, setConfig] = React.useState<PlayerConfig>({
    // posterResizeMode: 'cover',
    layoutMode: 'basic',
  });

  const ITEM_HEIGHT = 260;
  const FULL_ITEM_HEIGHT = dimension.height;

  const flatlistRef = React.useRef<FlatList>(null);

  const _onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimension;
    if (w !== width || h !== height) {
      setDimension({ width, height });
      console.log(`onLayoutChange:: width: ${width} height: ${height}`);
    }
  };


  const _onPress = () => {
    // console.log(`_onPress:: ${toggleFull}`);
  };

  React.useLayoutEffect(() => {
    console.log(`useLayoutEffect:: called`);
    navigation.setOptions({
      // headerShown: !isFullScreen,
      headerRight: () => (
        <IconButton onPress={_onPress}>
          <IconFlatList size={20} color={'#212121'} />
        </IconButton>
      ),
    });
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

  const playerRef = React.useRef<NexenPlayerRef>(null);

  const onFullScreenModeUpdate = (fullScreen: boolean, index?: number) => {
    // console.log(`Player: onFullScreenModeUpdate:${fullScreen}`);
    if (fullScreen) {
      // hideTabBar();
      // setFullScreenIndex(index?.index!);
      fullScreenIndex.current = index!
      // Orientation.lockToLandscape();
    } else {
      // showTabBar();
      // setFullScreenIndex(-1);
      fullScreenIndex.current = -1
      // Orientation.lockToPortrait();
    }
    setIsFullScreen(fullScreen);
  };

  const onPlay = (index?: number) => {
    // console.log(`Player: onPlay:${JSON.stringify(config)}`);
    quiteIndex.current = index!;
    setActiveIndex(index!);
  };

  const onSkipNext = (index: number) => {
    
    quiteIndex.current = index;
    console.log(`Player: onSkipNext:${index} quiteIndex: ${quiteIndex.current}`);
  };

  const onSkipBack = (index: number) => {
    
    quiteIndex.current = index;
    console.log(`Player: onSkipBack:${index} quiteIndex: ${quiteIndex.current}`);
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<PlaylistItem>): ReactElement<any, any> => {
    return (
      <View
        style={[
          styles.playerContainer,
          {
            width: '100%',
            height: index === fullScreenIndex.current ? FULL_ITEM_HEIGHT : ITEM_HEIGHT,
          },
        ]}
      >
        <NexenPlayer
          ref={playerRef}
          optimizationConfig={{
            index,
            activeIndex,
            optimize: true,
          }}
          style={[styles.player]}
          playerSource={{
            source: item.source,
            poster: item.poster,
            title: item.title,
            // playlist: {
            //   items: data,
            //   currentIndex: index,
            // },
          }}
          // playerConfig={{
          //   disableSkip: isFullScreen ? false : true,
          // }}
          insets={edgeinsets}
          onPlay={onPlay}
          onSkipNext={onSkipNext}
          onSkipBack={onSkipBack}
          onFullScreenModeUpdate={onFullScreenModeUpdate}
        />
      </View>
    );
  };

  React.useEffect(() => {
    if (isFullScreen) {
      hideTabBar();
    } else {
      showTabBar();
    }
    console.log(`fullScreenIndex: ${fullScreenIndex.current} quiteIndex: ${quiteIndex.current}`);
    if (fullScreenIndex.current >= 0) {
      flatlistRef.current?.scrollToOffset({
        animated: true,
        offset: (fullScreenIndex.current * ITEM_HEIGHT),
      });
    } else {
      flatlistRef.current?.scrollToOffset({
        animated: true,
        offset: (quiteIndex.current * ITEM_HEIGHT),
      });
      setActiveIndex(quiteIndex.current);
    }
  }, [isFullScreen]);

  return (
    <>
      <StatusBar hidden={isFullScreen} />
      <FlatList
        ref={flatlistRef}
        style={[
          styles.list,
        ]}
        onLayout={_onLayoutChange}
        data={data}
        renderItem={renderItem}
        initialScrollIndex={fullScreenIndex.current >= 0 ? fullScreenIndex.current : 0}
        scrollEnabled={isFullScreen ? false : true}
        pagingEnabled={isFullScreen ? true : false}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
      />
    </>
  );
};

export default FlatlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    zIndex: 1,
  },
  playerContainer: {
    width: '100%',
    height: '100%',
  },
  player: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'pink',
  },

});
