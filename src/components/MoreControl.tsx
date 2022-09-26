import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import type { NexenTheme } from '../utils/Theme';
import {
  IconFilm,
  IconReload,
  IconRepeat,
  IconUnlock,
  IconZap,
} from '../assets/icons';
import GradientView from './GradientView';
import { EdgeInsets, NexenConfig } from './NexenPlayer';
import { withAnimation } from '../hoc/withAnimation';
import ModalView from './ModalView';

export type MoreItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

type MoreControlProps = {
  fullScreen: boolean;
  disablePlaylistAndSkip?: boolean;
  insets?: EdgeInsets;
  playerConfig?: NexenConfig;
  nexenTheme?: NexenTheme;
  style?: StyleProp<ViewStyle>;
  onItemPress?: (item: MoreItem) => void;
};

const MoreControl = (props: MoreControlProps) => {
  const {
    style,
    fullScreen,
    disablePlaylistAndSkip,
    insets,
    playerConfig,
    nexenTheme,
    onItemPress,
  } = props;

  const [moreItems, setMoreItems] = React.useState<MoreItem[]>([]);
  const ICON_SIZE = nexenTheme?.sizes?.secondaryIconSize;
  const ICON_COLOR = nexenTheme?.colors?.secondaryIconColor;
  const TEXT_COLOR = nexenTheme?.colors?.secondaryTextColor;

  const CONTAINER_VERTICAL_PADDING = fullScreen
    ? (insets?.top! + insets?.bottom!) / 2 > 0
      ? (insets?.top! + insets?.bottom!) / 2
      : nexenTheme?.sizes?.paddingVertical
    : nexenTheme?.sizes?.paddingVertical;

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

    if (!disablePlaylistAndSkip && !playerConfig?.disablePlayList) {
      MORE_ITEMS.splice(3, 0, {
        id: 'playlist',
        icon: <IconFilm size={ICON_SIZE} color={ICON_COLOR} />,
        label: 'Video Playlist',
      });
    }
    setMoreItems(MORE_ITEMS);
  }, [playerConfig]);

  const containerStyle = {
    top: CONTAINER_VERTICAL_PADDING,
    bottom: CONTAINER_VERTICAL_PADDING,
    right: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
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
          onItemPress?.(item);
        }}
      >
        {item.icon}
        <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <ModalView style={[styles.container, style, containerStyle]}>
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
    </ModalView>
  );
};

export default withAnimation(MoreControl);

MoreControl.defaultProps = {};

const styles = StyleSheet.create({
  container: {
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
