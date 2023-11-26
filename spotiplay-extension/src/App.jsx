import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Controls from "./components/controls/Controls";
import TrackBar from "./components/trackbar/TrackBar";
import Volume from "./components/volume/Volume";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="top">
        <div class="split_div" id="song_div">
          <img class="icon" src={reactLogo}></img>
          <div id="song_info">
            <span id="song_info_title">Track Title</span>
            <span id="song_info_artist">Track Author</span>
          </div>
          <span id="song_heart">
            <span class="material-symbols-outlined hearted" id="favourite">
              favorite
            </span>
          </span>
        </div>

        <div class="split_div" id="control_div">
          <Controls />
          <Volume />
        </div>
      </div>
      <TrackBar />
    </>
  );
}

export default App;
