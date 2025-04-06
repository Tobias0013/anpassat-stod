import React from "react";
import "./buttonComp.css";

type ButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

export default function ButtonComp(props: ButtonProps) {
  const { text, onClick, className, styles, disabled } = props;

  return (
    <button
      disabled={disabled === true ? true : false}
      className={`buttonComp ${className ? `${className}` : ""}`}
      style={styles}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
