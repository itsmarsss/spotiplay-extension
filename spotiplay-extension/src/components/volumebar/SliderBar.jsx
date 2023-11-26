import "./SliderBar.css";

function SliderBar({ slider_width }) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      style={{ width: slider_width }}
    ></input>
  );
}

export default SliderBar;
