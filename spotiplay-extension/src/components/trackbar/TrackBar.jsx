import SliderBar from "../sliderbar/SliderBar";
import "./TrackBar.css";

function TrackBar({ position, duration, trackInput, trackChange }) {
  return (
    <>
      <div id="track_info">
        <span class="time">{position}</span>
        <SliderBar
          id={"track"}
          inputAction={trackInput}
          changeAction={trackChange}
          slider_width={"calc(100% - 100px)"}
          slider_height={"5px"}
        />
        <span class="time">{duration}</span>
      </div>
    </>
  );
}

export default TrackBar;
