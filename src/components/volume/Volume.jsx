import Button from "../button/Button";
import SliderBar from "../sliderbar/SliderBar";
import messageContentScript from "../../Controller";
import "./Volume.css";

function Volume({ muted, volumeInput, volumeChange }) {
  const mute = () => {
    messageContentScript({ action: "mute" });
  };

  return (
    <>
      <div id="song_volume">
        <Button
          clickAction={mute}
          icon={
            <span class="material-symbols-outlined side_button">
              {muted ? "volume_off" : "volume_up"}
            </span>
          }
        />
        <SliderBar
          id={"volumeLvl"}
          overlay_id={"volume_overlay"}
          inputAction={volumeInput}
          changeAction={volumeChange}
          slider_width={"170px"}
          slider_height={"3px"}
        />
      </div>
    </>
  );
}

export default Volume;
