import { useState } from "react";
import "./App.css";

import Controls from "./components/controls/Controls";
import TrackBar from "./components/trackbar/TrackBar";
import SongInfo from "./components/songinfo/SongInfo";
import Volume from "./components/volume/Volume";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="top">
        <div class="split_div" id="song_div">
          <SongInfo />
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
