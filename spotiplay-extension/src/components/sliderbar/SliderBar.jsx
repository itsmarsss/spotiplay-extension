import "./SliderBar.css";

function SliderBar({
  id,
  overlay_id,
  inputAction,
  changeAction,
  slider_width,
  slider_height,
}) {
  const calculatedHeight = `calc(${slider_height} * 2.5)`;
  const formattedBorder = `solid var(--background) ${slider_height}`;

  return (
    <>
      <input
        id={id}
        onInput={inputAction}
        onMouseUp={changeAction}
        type="range"
        min={0}
        max={100}
        step={0.1}
        style={{
          width: slider_width,
          height: slider_height,
          border: formattedBorder,
        }}
      ></input>
      <div
        class="overlay"
        id={overlay_id}
        style={{ width: calculatedHeight }}
      ></div>
    </>
  );
}

export default SliderBar;
