import Button from "../button/Button";
import SliderBar from "../sliderbar/SliderBar";
import "./Volume.css";

function Volume() {
  return (
    <>
      <div id="song_volume">
        <Button
          icon={
            <span class="material-symbols-outlined side_button">volume_up</span>
          }
        />
        <SliderBar slider_width={"150px"} />
      </div>
    </>
  );
}

export default Volume;
