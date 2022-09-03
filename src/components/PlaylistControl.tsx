import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import GradientView from './GradientView';
import { NexenTheme } from '../utils/Theme';
import { Dimension, PlaylistItem } from './NexenPlayer';
import { IconPlayCircle } from '../../assets/icons';

// const { width, height } = Dimensions.get('window');

type PlaylistControlProps = {
  fullScreen: boolean;
  opacity: Animated.Value;
  marginBottom: Animated.Value;
  playList?: PlaylistItem[];
  playListIndex?: number;
  nexenTheme?: NexenTheme;
  dimension?: Dimension;
  style?: StyleProp<ViewStyle>;
  onPlayListItemPress?: (index: number) => void;
};

const PlaylistControl = (props: PlaylistControlProps) => {
  const {
    style,
    opacity,
    marginBottom,
    playList,
    playListIndex,
    fullScreen,
    nexenTheme,
    dimension,
    onPlayListItemPress,
  } = props;
  const { width, height } = dimension!;
  const minValue = Math.min(Number(width), Number(height));
  // console.log(
  //   `PlaylistControl: renders: ${playList?.length} minValue: ${minValue}`
  // );

  const playlistRef = React.useRef<FlatList>(null);

  const CONTAINER_HEIGHT = minValue * 0.35;
  const CONTAINER_PADDING = 16;
  const ITEM_HEIGHT = CONTAINER_HEIGHT - CONTAINER_PADDING * 2;
  const ITEM_WIDTH = ITEM_HEIGHT * (16 / 9);
  const ICON_SIZE = ITEM_HEIGHT * 0.6;

  // console.log(`ITEM_HEIGHT: ${ITEM_HEIGHT} ITEM_WIDTH: ${ITEM_WIDTH}`)

  const renderPlayListItem = ({
    item,
    index,
  }: ListRenderItemInfo<PlaylistItem>) => {
    const itemStyle = {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
    };
    // console.log(`poster: ${item.poster}`);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, itemStyle]}
        activeOpacity={0.6}
        onPress={() => {
          onPlayListItemPress?.(index);
          // console.log(`item: ${item.id}`)
        }}
      >
        <Image
          style={[styles.image, itemStyle]}
          source={{ uri: item.poster }}
        />
        {index !== playListIndex && (
          <IconPlayCircle
            style={styles.icon}
            size={ICON_SIZE}
            color={'#fafafa'}
          />
        )}
      </TouchableOpacity>
    );
  };

  const containerStyle = {
    opacity,
    marginBottom,
    height: CONTAINER_HEIGHT,
  };

  React.useEffect(() => {
    // playlistRef.current?.scrollToIndex({index: playListIndex!, animated: true});
  }, [])

  return (
    <Animated.View style={[styles.container, style, containerStyle]}>
      <GradientView
        style={{
          height: '100%',
          width: '100%',
        }}
        startOpacity={0.0}
        middleOpacity={0.2}
        endOpacity={0.5}
      />
      <View style={[styles.innerContainer]}>
        <FlatList
          ref={playlistRef}
          style={styles.list}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
          data={playList}
          renderItem={renderPlayListItem}
          initialScrollIndex={playListIndex}
          horizontal
          bounces={false}
        />
      </View>
    </Animated.View>
  );
};

export default PlaylistControl;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 0,
    // minHeight: 100,
    // maxHeight: 200,
    overflow: 'hidden',
    zIndex: 110,
  },
  innerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    // backgroundColor: 'orange',
  },
  list: {
    flex: 1,
    // backgroundColor: 'red'
  },
  itemContainer: {
    // width: 100,
    // height: '100%',
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 5,
    // paddingVertical: 10,
  },
  image: {
    resizeMode: 'cover',
    // backgroundColor: 'blue'
  },
  icon: {
    position: 'absolute',
  },
});
