import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Button from "./components/Button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="split_div" id="song_div">
        <img className="icon" src={reactLogo}></img>
        <div id="song_info">
          <span id="song_info_title">Track Title</span>
          <span id="song_info_artist">Track Author</span>
        </div>
        <span id="song_heart">
          <span className="material-symbols-outlined hearted" id="favourite">
            favorite
          </span>
        </span>
      </div>

      <div className="split_div">
        <div id="song_control">
          <Button />
          <Button />
          <Button />
          <Button />
          <Button />
        </div>
        <div id="song_progress">
          <input type="range"></input>
        </div>
      </div>
    </>
  );
}

export default App;
