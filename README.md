# expo-nexen-player

A next gen video player for expo app based on `expo-av`. It provides advanced media control functionality.

## Preview

![@](https://github.com/r3tr0c0d3r/expo-nexen-player/blob/master/demo/expo_nexen_player.gif?raw=true)

## Installation

```sh
npm install --save expo-nexen-player
```

or

```sh
yarn add expo-nexen-player
```

## Dependencies

```sh
yarn add expo-av expo-brightness react-native-svg
```

## Usage

```js
import NexenPlayer, { NexenPlayerRef } from 'expo-nexen-player';

// ...

const [paused, setPaused] = React.useState(true);
const playerRef = React.useRef < NexenPlayerRef > null;

const onPausePress = () => {
  if (paused) {
    playerRef.current?.play();
  } else {
    playerRef?.current?.pause();
  }
  setPaused((prevState) => !prevState);
};

<NexenPlayer
  ref={playerRef}
  style={styles.player}
  source={{
    source: require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4'),
    poster: 'https://img.youtube.com/vi/KrmxD8didgQ/0.jpg',
    title: "Ryu's Hurricane Kick and Hadoken",
  }}
/>;

// ...
```

## Component props

| prop     | type                                           | default | description                                                                               |
| -------- | ---------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| source   | NexenPlayer [NexenSource](#NexenSource) object | {}      | media source.                                                                             |
| config   | NexenPlayer [NexenConfig](#NexenConfig) object | {}      | vidoe player config.                                                                      |
| playList | object                                         | {}      | can set video playlist for the player.                                                    |
| insets   | object                                         | {}      | edge insets for video controls. you can set insets from `react-native-safe-area-context`. |
| style    | object                                         | {}      | style for video player.                                                                   |
| theme    | object                                         | {}      | set theme for video player.                                                               |

### NexenSource

| prop   | type                                 | default | description   |
| ------ | ------------------------------------ | ------- | ------------- |
| source | AVPlaybackSource object from expo-av | {}      | media source. |
| title  | string                               | ''      | video title.  |
| poster | string                               | ''      | poster url.   |

### NexenConfig

| prop                      | type                   | default      | description                                                                            |
| ------------------------- | ---------------------- | ------------ | -------------------------------------------------------------------------------------- |
| loaderText                | string                 | 'Loading...' | text for loader.                                                                       |
| errorText                 | string                 | 'Error...!'  | text for error message.                                                                |
| doubleTapTime             | number                 | 300ms        | duration of double tap.                                                                |
| controlTimeout            | number                 | 500ms        | main control will hide after this amount of time when `controlHideMode` set to 'auto'. |
| controlHideMode           | string                 | 'touch'      | hide options for main control - 'touch' or 'auto'.                                     |
| layoutMode                | stirng                 | 'basic'      | options for main control layout - 'basic', 'intermediate' or 'advanced'.               |
| resizeMode                | `ResizeMode` object    | 'contain'    | video resize options.                                                                  |
| posterResizeMode          | `ResizeMode` object    | 'cover'      | poster resize options.                                                                 |
| volume                    | number                 | 80           | volume of the video (0-100).                                                           |
| brightness                | number                 | 25           | brightness of the video (0-100).                                                       |
| playbackSpeed             | `PlaybackSpeed` objecj | '1.0'        | video playback speed.                                                                  |
| muted                     | boolean                | false        | mute video.                                                                            |
| repeat                    | boolean                | false        | repeat video.                                                                          |
| autoPlay                  | boolean                | false        | should autoplay the video.                                                             |
| disableOnScreenPlayButton | boolean                | false        | a large play button that appears on screen when video is paused.                       |
| disableBack               | boolean                | false        | hide back button.                                                                      |
| disableResizeMode         | boolean                | false        | hide aspect ration button.                                                             |
| disableVolume             | boolean                | false        | hide volume button.                                                                    |
| disableMore               | boolean                | false        | hide more button.                                                                      |
| disableSkip               | boolean                | false        | hide skip buttons.                                                                     |
| disableStop               | boolean                | false        | hide stop button.                                                                      |
| disableRelod              | boolean                | false        | hide reload button.                                                                    |
| disableFullscreen         | boolean                | false        | hide fullscreen button.                                                                |
| disablePlayList           | boolean                | false        | hide video playlist button.                                                            |
| index                     | number                 | 0            | flatlist index (only for FlatList)                                                     |
| activeIndex               | number                 | -1           | flatlist current video index (only for FlatList)                                       |
| optimize                  | boolean                | false        | wheather you need flatlist optimization or not (only for FlatList)                     |

## Enevt props

| prop                   | type | default   | description                                |
| ---------------------- | ---- | --------- | ------------------------------------------ |
| onBackPressed          | func | undefined | callback for back button.                  |
| onPlay                 | func | undefined | callback for play button.                  |
| onPause                | func | undefined | callback for pause button.                 |
| onStop                 | func | undefined | callback for stop button.                  |
| onSkipNext             | func | undefined | callback for skipNext event.               |
| onSkipBack             | func | undefined | callback for skipBack event.               |
| onReload               | func | undefined | callback for reload event.                 |
| onVolumeUpdate         | func | undefined | callback for volume update event.          |
| onBrightnessUpdate     | func | undefined | callback for brightness update event.      |
| onMuteUpdate           | func | undefined | callback for mute button.                  |
| onLoopUpdate           | func | undefined | callback for loop button.                  |
| onSpeedUpdate          | func | undefined | callback for playback speed update event.  |
| onFullScreenModeUpdate | func | undefined | callback for fullscreen mode update event. |
| onScreenLockUpdate     | func | undefined | callback for screen lock update event.     |
| onPlayListItemSelect   | func | undefined | callback for video list item select event. |
| onLoad                 | func | undefined | callback for video load event.             |
| onError                | func | undefined | callback for video load error event.       |

## Methods

| prop              | type | default   | description             |
| ----------------- | ---- | --------- | ----------------------- |
| play              | func | undefined | call to play a video.   |
| pause             | func | undefined | call to pause a video.  |
| stop              | func | undefined | call to stop a video.   |
| skipNext          | func | undefined | skip to next video.     |
| skipBack          | func | undefined | skip to prvious video.  |
| reload            | func | undefined | call to reload a video. |
| load              | func | undefined | call to load a video.   |
| setFullScreenMode | func | undefined | set fullscreen mode.    |

## ToDo

- [ ] Custom icon support
- [ ] Improve fullscreen support
- [ ] Better documentation

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
