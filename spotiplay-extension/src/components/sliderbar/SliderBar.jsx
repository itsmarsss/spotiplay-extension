import "./SliderBar.css";

function SliderBar({
  id,
  inputAction,
  changeAction,
  slider_width,
  slider_height,
}) {
  return (
    <input
      id={id}
      onInput={inputAction}
      onMouseUp={changeAction}
      type="range"
      min={0}
      max={100}
      step={0.1}
      style={{ width: slider_width, height: slider_height }}
    ></input>
  );
}

export default SliderBar;
