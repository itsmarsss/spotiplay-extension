import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Button from "./components/button/Button";
import SliderBar from "./components/volumebar/SliderBar";

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
          <div id="song_control">
            <Button
              icon={
                <span class="material-symbols-outlined side_button">
                  shuffle
                </span>
              }
            />
            <Button
              icon={
                <span class="material-symbols-outlined side_button">
                  skip_previous
                </span>
              }
            />
            <Button
              class="main_button"
              icon={
                <span class="material-symbols-outlined main_button_icon">
                  play_arrow
                </span>
              }
            />
            <Button
              icon={
                <span class="material-symbols-outlined side_button">
                  skip_next
                </span>
              }
            />
            <Button
              icon={
                <span class="material-symbols-outlined side_button">
                  repeat
                </span>
              }
            />
          </div>
          <div id="song_progress">
            <Button
              icon={
                <span class="material-symbols-outlined side_button">
                  volume_up
                </span>
              }
            />
            <SliderBar slider_width={"150px"} />
          </div>
        </div>
      </div>
      <SliderBar slider_width={"calc(100% - 50px)"} />
    </>
  );
}

export default App;
