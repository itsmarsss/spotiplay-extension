import Button from "../button/Button";
import "./SongIcon.css";
import messageContentScript from "../../Controller";

function SongIcon({ url, hearted }) {
  const heart = () => {
    messageContentScript({ action: "heart" });
  };

  return (
    <>
      <div id="song_icon">
        <img class="icon" src={url}></img>
        <span id="song_heart">
          <Button
            clickAction={heart}
            icon={
              <span
                class={
                  "material-symbols-outlined " + (hearted ? "hearted" : "")
                }
                id="favourite"
              >
                favorite
              </span>
            }
          />
        </span>
      </div>
    </>
  );
}

export default SongIcon;
