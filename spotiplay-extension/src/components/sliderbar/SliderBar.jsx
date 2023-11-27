import "./SliderBar.css";

function SliderBar({ id, inputAction, slider_width }) {
  return (
    <input
      id={id}
      onInput={inputAction}
      type="range"
      min={0}
      max={100}
      step={1}
      style={{ width: slider_width }}
    ></input>
  );
}

export default SliderBar;
