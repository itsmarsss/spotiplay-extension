import "./SongInfo.css";

import reactLogo from "../../assets/react.svg";
import viteLogo from "../../../public/vite.svg";

function SongInfo() {
  return (
    <>
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
    </>
  );
}

export default SongInfo;
