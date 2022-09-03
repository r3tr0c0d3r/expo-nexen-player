import React from 'react';
import {
  Animated,
  FlatList,
  GestureResponderEvent,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import type { NexenTheme } from '../utils/Theme';
import { getAlphaColor } from '../utils/ColorUtil';
import {
  IconFilm,
  IconInfo,
  IconReload,
  IconRepeat,
  IconUnlock,
  IconZap,
} from './../../assets/icons';
import GradientView from './GradientView';

export type MoreItem = {
  id: string;
  icon: JSX.Element;
  label: string;
  // onPress: () => void;
};

type MoreControlProps = {
  opacity: Animated.Value;
  marginRight: Animated.Value;
  fullScreen: boolean;
  disablePlaylist?: boolean;
  nexenTheme?: NexenTheme;
  style?: StyleProp<ViewStyle>;
  onItemPress?: (item: MoreItem) => void;
};

const MoreControl = (props: MoreControlProps) => {
  const {
    opacity,
    marginRight,
    style,
    fullScreen,
    disablePlaylist,
    nexenTheme,
    onItemPress,
  } = props;
  const [moreItems, setMoreItems] = React.useState<MoreItem[]>([]);
  const ICON_SIZE = fullScreen ? 24 : 20;
  const ICON_COLOR = nexenTheme?.colors?.secondaryIconColor;
  const TEXT_COLOR = nexenTheme?.colors?.secondaryTextColor;
  const CONTAINER_BACKGROUND_COLOR = getAlphaColor(
    nexenTheme?.colors?.primaryColor!,
    0.7
  );
  const CONTAINER_BORDER_RADIUS = nexenTheme?.sizes?.modalCornerRadius;
  // console.log(`CONTAINER_BORDER_RADIUS: ${CONTAINER_BORDER_RADIUS}`)

  React.useEffect(() => {
    const MORE_ITEMS = [
      {
        id: 'lock',
        icon: <IconUnlock size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Lock',
      },
      {
        id: 'speed',
        icon: <IconZap size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Playback Speed',
      },
      {
        id: 'repeat',
        icon: <IconRepeat size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Repeat Mode',
      },
      {
        id: 'reload',
        icon: <IconReload size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Reload Video',
      },
      // {
      //   id: 'info',
      //   icon: <IconInfo size={ICON_SIZE} color={ICON_COLOR} />,
      //   label: 'Video Info',
      // },
    ];

    if (!disablePlaylist) {
      MORE_ITEMS.splice(3, 0, {
        id: 'playlist',
        icon: <IconFilm size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Video Playlist',
      });
    }
    setMoreItems(MORE_ITEMS);
  }, [disablePlaylist]);

  const containerStyle = {
    opacity,
    marginRight,
    backgroundColor: CONTAINER_BACKGROUND_COLOR,
    borderTopLeftRadius: CONTAINER_BORDER_RADIUS,
    borderBottomLeftRadius: CONTAINER_BORDER_RADIUS,
  };

  const itemTextStyle = {
    color: TEXT_COLOR,
    fontFamily: nexenTheme?.fonts?.secondaryFont,
  };

  const renderMoreItem = ({ item }: ListRenderItemInfo<MoreItem>) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.6}
        onPress={() => {
          onItemPress && onItemPress(item);
          // console.log(`item: ${item.id}`)
        }}
      >
        {item.icon}
        <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Animated.View style={[styles.container, style, containerStyle]}>
      <GradientView
        style={{
          height: '100%',
          width: '100%',
        }}
        startPoint={{ x: 0, y: 0 }}
        endPoint={{ x: 1, y: 0 }}
        startOpacity={0.0}
        middleOpacity={0.2}
        endOpacity={0.5}
      />
      <TouchableOpacity style={styles.listContainer} activeOpacity={1}>
        <FlatList
          keyExtractor={(item: MoreItem) => item.id}
          data={moreItems}
          renderItem={renderMoreItem}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MoreControl;

MoreControl.defaultProps = {
  iconSize: 24,
  iconColor: '#fafafa',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 0,
    bottom: 8,
    minWidth: 168,
    maxWidth: 220,
    zIndex: 110,
    overflow: 'hidden',
  },
  listContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 15,
    marginLeft: 16,
  },
});
