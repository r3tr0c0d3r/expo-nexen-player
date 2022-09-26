import React, { ReactElement } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NexenPlayer, { NexenPlayerRef, PlayListItem } from 'expo-nexen-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getData } from './data';
import { StatusBar } from 'expo-status-bar';

const FlatlistScreen = () => {
  // console.log(`FlatlistScreen :: width: ${width} height: ${height}`);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
  const navigation = useNavigation();
  const edgeinsets = useSafeAreaInsets();
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  // const [fullScreenIndex, setFullScreenIndex] = React.useState(-1);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const fullScreenIndex = React.useRef(-1);
  const quiteIndex = React.useRef(0);

  const ITEM_HEIGHT = 260;
  const FULL_ITEM_HEIGHT = dimension.height;

  const flatlistRef = React.useRef<FlatList>(null);
  const playerRef = React.useRef<NexenPlayerRef>(null);

  const _onLayoutChange = async (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { width: w, height: h } = dimension;
    if (w !== width || h !== height) {
      setDimension({ width, height });
      console.log(`onLayoutChange:: width: ${width} height: ${height}`);
    }
  };

  React.useLayoutEffect(() => {
    console.log(`useLayoutEffect:: called`);
    navigation.setOptions({
      // headerShown: !isFullScreen,
      // headerRight: () => (
      //   <IconButton onPress={_onPress}>
      //     <IconFlatList size={20} color={'#212121'} />
      //   </IconButton>
      // ),
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

  const onFullScreenModeUpdate = (fullScreen: boolean, index?: number) => {
    if (fullScreen) {
      fullScreenIndex.current = index!;
    } else {
      fullScreenIndex.current = -1;
    }
    setIsFullScreen(fullScreen);
  };

  const onPlay = (index?: number) => {
    quiteIndex.current = index!;
    setActiveIndex(index!);
  };

  const onSkipNext = (index: number) => {
    quiteIndex.current = index;
    console.log(
      `Player: onSkipNext:${index} quiteIndex: ${quiteIndex.current}`
    );
  };

  const onSkipBack = (index: number) => {
    quiteIndex.current = index;
    console.log(
      `Player: onSkipBack:${index} quiteIndex: ${quiteIndex.current}`
    );
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<PlayListItem>): ReactElement<any, any> => {
    return (
      <View
        style={[
          styles.playerContainer,
          {
            width: '100%',
            height:
              index === fullScreenIndex.current
                ? FULL_ITEM_HEIGHT
                : ITEM_HEIGHT,
          },
        ]}
      >
        <NexenPlayer
          ref={playerRef}
          config={{
            index,
            activeIndex,
            optimize: true,
          }}
          style={[styles.player]}
          source={{
            source: item.itemSource.source,
            poster: item.itemSource.poster,
            title: item.itemSource.title,
          }}
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
    console.log(
      `fullScreenIndex: ${fullScreenIndex.current} quiteIndex: ${quiteIndex.current}`
    );
    if (fullScreenIndex.current >= 0) {
      flatlistRef.current?.scrollToOffset({
        animated: true,
        offset: fullScreenIndex.current * ITEM_HEIGHT,
      });
    } else {
      flatlistRef.current?.scrollToOffset({
        animated: true,
        offset: quiteIndex.current * ITEM_HEIGHT,
      });
      setActiveIndex(quiteIndex.current);
    }
  }, [isFullScreen]);

  return (
    <>
      <StatusBar hidden={isFullScreen} />
      <FlatList
        ref={flatlistRef}
        style={[styles.list]}
        onLayout={_onLayoutChange}
        data={getData()}
        renderItem={renderItem}
        initialScrollIndex={
          fullScreenIndex.current >= 0 ? fullScreenIndex.current : 0
        }
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
