import "./App.css";

import Controls from "./components/controls/Controls";
import TrackBar from "./components/trackbar/TrackBar";
import SongIcon from "./components/songicon/SongIcon";
import SongInfo from "./components/songinfo/SongInfo";
import Volume from "./components/volume/Volume";

function App({
  url,
  titleURL,
  authorURL,
  title,
  author,
  shuffled,
  shuffleMode,
  paused,
  repeated,
  muted,
  volumeInput,
  volumeChange,
  trackInput,
  trackChange,
  position,
  duration,
}) {
  return (
    <>
      <div class="top">
        <div class="split_div" id="song_div">
          <SongIcon url={url} />
        </div>

        <div class="split_div" id="control_div">
          <Controls
            shuffled={shuffled}
            shuffleMode={shuffleMode}
            paused={paused}
            repeated={repeated}
          />
          <Volume
            muted={muted}
            volumeInput={volumeInput}
            volumeChange={volumeChange}
          />
        </div>
      </div>
      <TrackBar
        position={position}
        duration={duration}
        trackInput={trackInput}
        trackChange={trackChange}
      />
      <SongInfo
        titleURL={titleURL}
        authorURL={authorURL}
        title={title}
        author={author}
      />
    </>
  );
}

export default App;
