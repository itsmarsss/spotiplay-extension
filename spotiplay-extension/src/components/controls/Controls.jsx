import Button from "../button/Button";
import "./Controls.css";

function Controls() {
  return (
    <>
      <div id="song_control">
        <Button
          icon={
            <span class="material-symbols-outlined side_button">shuffle</span>
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
            <span class="material-symbols-outlined side_button">skip_next</span>
          }
        />
        <Button
          icon={
            <span class="material-symbols-outlined side_button">repeat</span>
          }
        />
      </div>
    </>
  );
}

export default Controls;
