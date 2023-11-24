import "./VolumeBar.css";

function VolumeBar() {
  return <input type="range" min={0} max={100} step={1}></input>;
}

export default VolumeBar;
