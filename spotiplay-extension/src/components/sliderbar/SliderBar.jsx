import "./SliderBar.css";

function SliderBar({ id, inputAction, changeAction, slider_width }) {
  return (
    <input
      id={id}
      onInput={inputAction}
      onMouseUp={changeAction}
      type="range"
      min={0}
      max={100}
      step={0.1}
      style={{ width: slider_width }}
    ></input>
  );
}

export default SliderBar;
