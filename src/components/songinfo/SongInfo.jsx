import "./SongInfo.css";

function SongInfo({ titleURL, authorURL, title, author }) {
  return (
    <>
      <div id="song_info">
        <a href={titleURL} target="_blank">
          <span id="song_info_title" class="tooltip">
            <span class="tooltiptext">{title}</span>
            {title}
          </span>
        </a>
        <span>|</span>
        <a href={authorURL} target="_blank">
          <span id="song_info_artist" class="tooltip">
            <span class="tooltiptext">{author}</span>
            {author}
          </span>
        </a>
      </div>
    </>
  );
}

export default SongInfo;
