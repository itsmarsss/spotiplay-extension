import Button from "../button/Button";
import "./SongInfo.css";
import messageContentScript from "../../Controller";

function SongInfo({ url, titleURL, authorURL, title, author, hearted }) {
  const heart = () => {
    messageContentScript({ action: "heart" });
  };

  return (
    <>
      <img class="icon" src={url}></img>
      <div id="song_info">
        <a href={titleURL} target="_blank">
          <span id="song_info_title" class="tooltip">
            <span class="tooltiptext">{title}</span>
            {title}
          </span>
        </a>
        <a href={authorURL} target="_blank">
          <span id="song_info_artist" class="tooltip">
            <span class="tooltiptext">{author}</span>
            {author}
          </span>
        </a>
      </div>
      <span id="song_heart">
        <Button
          clickAction={heart}
          icon={
            <span
              class={"material-symbols-outlined " + (hearted ? "hearted" : "")}
              id="favourite"
            >
              favorite
            </span>
          }
        />
      </span>
    </>
  );
}

export default SongInfo;
