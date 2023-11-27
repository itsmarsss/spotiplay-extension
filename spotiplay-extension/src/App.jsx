import { useState } from "react";
import "./App.css";

import Controls from "./components/controls/Controls";
import TrackBar from "./components/trackbar/TrackBar";
import SongInfo from "./components/songinfo/SongInfo";
import Volume from "./components/volume/Volume";

function App({
  url,
  titleURL,
  authorURL,
  title,
  author,
  hearted,
  shuffled,
  paused,
  repeated,
  muted,
  volume,
}) {
  return (
    <>
      <div class="top">
        <div class="split_div" id="song_div">
          <SongInfo
            url={url}
            titleURL={titleURL}
            authorURL={authorURL}
            title={title}
            author={author}
            hearted={hearted}
          />
        </div>

        <div class="split_div" id="control_div">
          <Controls shuffled={shuffled} paused={paused} repeated={repeated} />
          <Volume muted={muted} volume={volume} />
        </div>
      </div>
      <TrackBar />
    </>
  );
}

export default App;
