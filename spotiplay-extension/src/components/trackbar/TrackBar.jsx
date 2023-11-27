import SliderBar from "../sliderbar/SliderBar";
import "./TrackBar.css";

function TrackBar({ position, duration }) {
  return (
    <>
      <div id="track_info">
        <span class="time">{position}</span>
        <SliderBar slider_width={"calc(100% - 100px)"} />
        <span class="time">{duration}</span>
      </div>
    </>
  );
}

export default TrackBar;
