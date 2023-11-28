import "./SongIcon.css";

function SongIcon({ url }) {
  return (
    <>
      <div id="song_icon">
        <img class="icon" src={url}></img>
      </div>
    </>
  );
}

export default SongIcon;
