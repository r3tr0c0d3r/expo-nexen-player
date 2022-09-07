# expo-nexen-player

A next generation video player for expo based on `expo-av`. It provides advanced media control functionality.

## Preview

![@](./demo/expo_nexen_player.gif)

## Installation

```sh
npm install expo-nexen-player
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
const playerRef = React.useRef<NexenPlayerRef>(null);

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
    source={require('../assets/videos/Street_Fighter_V_Stop_Motion.mp4')}/>

// ...
```




  style?: StyleProp<ViewStyle>;
  theme?: NexenTheme;
  insets?: EdgeInsets;

## Component props

| prop                      | type     | default      | description                                 |
| ------------------------- | -------- | ------------ | --------------------------------------------|
| source                    | object   | {}           | media source.       |
| poster                    | string   | ''           | poster url.       |
| posterStyle               | object   | {}           | poster style.      |
| title                     | string   | ''           | text for video title.    |
| loadingText               | string   | 'Loading...' | text for loader.  |
| errorText                 | string   | 'Error...!'  | text for error message.            |
| doubleTapTime             | number   | 300ms        | duration of double tap. |
| controlTimeout            | number   | 500ms        | main control will hide after this amount of time when `controlHideMode` set to 'auto'. |
| controlHideMode           | string   | 'touch'      | hide options for main control - 'touch' or 'auto'. |
| layoutMode                | stirng   | 'basic'      | options for main control layout - 'basic', 'intermediate' or 'advanced'.        |
| insets                    | object   | {}           | edge insets for video controls. you can set insets from `react-native-safe-area-context`.|
| style                     | object   | {}           | style for video player.    |
| theme                     | object   | {}           | set theme for video player.    |
| disableOnScreenPlayButton | boolean  | false        | a large play button that appears on screen when video is paused. |
| disableBack               | boolean  | false        | hide back button. |
| disableResizeMode         | boolean  | false        | hide aspect ration button. |
| disableVolume             | boolean  | false        | hide volume button. |
| disableMore               | boolean  | false        | hide more button. |
| disableSkip               | boolean  | false        | hide skip buttons. |
| disableStop               | boolean  | false        | hide stop button. |
| disableFullscreen         | boolean  | false        | hide fullscreen button. |
| disablePlaylist           | boolean  | () => {}     | hide video playlist button. |

## Enevt props
| prop                      | type     | default      | description                                 |
| ------------------------- | -------- | ------------ | --------------------------------------------|
| onBackPressed             | func     | () => {}     | callback for back button.|
| onPlay                    | func     | () => {}     | callback for play button.|
| onPause                   | func     | () => {}     | callback for pause button.|
| onStop                    | func     | () => {}     | callback for stop button.|
| onSkipNext                | func     | () => {}     | callback for skipNext event.|
| onSkipBack                | func     | () => {}     | callback for skipBack event.|
| onReload                  | func     | () => {}     | callback for reload event.|
| onVolumeUpdate            | func     | () => {}     | callback for volume update event.|
| onBrightnessUpdate        | func     | () => {}     | callback for brightness update event.|
| onMuteUpdate              | func     | () => {}     | callback for mute button.|
| onLoopUpdate              | func     | () => {}     | callback for loop button.|
| onSpeedUpdate             | func     | () => {}     | callback for playback speed update event.|
| onFullScreenModeUpdate    | func     | () => {}     | callback for fullscreen mode update event.|
| onScreenLockUpdate        | func     | () => {}     | callback for screen lock update event.|
| onPlaylistItemSelect      | func     | () => {}     | callback for video list item select event.|

## Methods
| prop                      | type     | default      | description                                 |
| ------------------------- | -------- | ------------ | --------------------------------------------|
| play                      | func     | () => {}     | call to play a video.|
| pause                     | func     | () => {}     | call to pause a video.|
| stop                      | func     | () => {}     | call to stop a video.|
| skipNext                  | func     | () => {}     | skip to next video.|
| skipBack                  | func     | () => {}     | skip to prvious video.|
| reload                    | func     | () => {}     | call to reload a video.|
| setLoop                   | func     | () => {}     | call to loop a video.|
| setMuted                  | func     | () => {}     | call to mute a video.|
| setVolume                 | func     | () => {}     | set volume of player (0 to 100).|
| setBrightness             | func     | () => {}     | set brightness of player (0 to 100).|
| setPlaybackSpeed          | func     | () => {}     | set video playback speed for player.|
| setPlaylist               | func     | () => {}     | set video playlist.|
| setActiveIndex            | func     | () => {}     | set index of playlist which will be played.|
| setResizeMode             | func     | () => {}     | set video aspect ratio.|
| setFullScreenMode         | func     | () => {}     | set fullscreen mode.|

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
