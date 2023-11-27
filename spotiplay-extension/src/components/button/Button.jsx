import "./Button.css";

function Button({ clickAction, icon }) {
  return <button onClick={clickAction}>{icon}</button>;
}

export default Button;
