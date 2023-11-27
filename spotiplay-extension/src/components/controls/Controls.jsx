import Button from "../button/Button";
import messageContentScript from "../../Controller";
import "./Controls.css";

function Controls({ shuffled, paused, repeated }) {
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
            <span
              class={
                "material-symbols-outlined side_button " +
                (shuffled ? "active" : "")
              }
            >
              shuffle
            </span>
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
          classNames={"main_button"}
          clickAction={playpause}
          icon={
            <span class="material-symbols-outlined main_button_icon">
              {paused ? "play_arrow" : "pause"}
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
            <span
              class={
                "material-symbols-outlined side_button " +
                (repeated ? "active" : "")
              }
            >
              repeat
            </span>
          }
        />
      </div>
    </>
  );
}

export default Controls;
