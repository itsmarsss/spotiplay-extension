import SliderBar from "../sliderbar/SliderBar";
import "./TrackBar.css";

function TrackBar() {
  return (
    <>
      <span>0:00</span>
      <SliderBar slider_width={"calc(100% - 50px)"} />
      <span>0:00</span>
    </>
  );
}

export default TrackBar;
