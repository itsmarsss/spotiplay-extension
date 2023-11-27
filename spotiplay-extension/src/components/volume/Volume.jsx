import Button from "../button/Button";
import SliderBar from "../sliderbar/SliderBar";
import messageContentScript from "../../Controller";
import "./Volume.css";

function Volume() {
  const mute = () => {
    messageContentScript({ action: "mute" });
  };

  const volume = () => {
    messageContentScript({
      action: "volume",
      value: document.getElementById("volumeLvl").value,
    });
  };

  return (
    <>
      <div id="song_volume">
        <Button
          clickAction={mute}
          icon={
            <span class="material-symbols-outlined side_button">volume_up</span>
          }
        />
        <SliderBar
          id={"volumeLvl"}
          inputAction={volume}
          slider_width={"150px"}
        />
      </div>
    </>
  );
}

export default Volume;
