import "./Button.css";

function Button({ classNames, clickAction, icon }) {
  return (
    <button class={classNames} onClick={clickAction}>
      {icon}
    </button>
  );
}

export default Button;
