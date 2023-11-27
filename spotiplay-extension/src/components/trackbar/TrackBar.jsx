import SliderBar from "../sliderbar/SliderBar";
import "./TrackBar.css";

function TrackBar({ position, duration, trackInput, trackChange }) {
  return (
    <>
      <div id="track_info">
        <span class="time">{position}</span>
        <SliderBar
          id={"track"}
          slider_width={"calc(100% - 100px)"}
          inputAction={trackInput}
          changeAction={trackChange}
        />
        <span class="time">{duration}</span>
      </div>
    </>
  );
}

export default TrackBar;
