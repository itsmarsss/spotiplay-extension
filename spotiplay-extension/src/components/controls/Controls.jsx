import Button from "../button/Button";
import messageContentScript from "../../Controller";
import "./Controls.css";

function Controls() {
  const shuffle = () => {
    messageContentScript({ action: "shuffle" });
  };
  const prev = () => {
    messageContentScript({ action: "prev" });
  };
  const playpause = () => {
    messageContentScript({ action: "playpause" });
  };
  const next = () => {
    messageContentScript({ action: "next" });
  };
  const repeat = () => {
    messageContentScript({ action: "repeat" });
  };

  return (
    <>
      <div id="song_control">
        <Button
          clickAction={shuffle}
          icon={
            <span class="material-symbols-outlined side_button">shuffle</span>
          }
        />
        <Button
          clickAction={prev}
          icon={
            <span class="material-symbols-outlined side_button">
              skip_previous
            </span>
          }
        />
        <Button
          class="main_button"
          clickAction={playpause}
          icon={
            <span class="material-symbols-outlined main_button_icon">
              play_arrow
            </span>
          }
        />
        <Button
          clickAction={next}
          icon={
            <span class="material-symbols-outlined side_button">skip_next</span>
          }
        />
        <Button
          clickAction={repeat}
          icon={
            <span class="material-symbols-outlined side_button">repeat</span>
          }
        />
      </div>
    </>
  );
}

export default Controls;
