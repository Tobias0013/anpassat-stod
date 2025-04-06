
import React from "react";
import "./buttonComp.css";

type ButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

/**
 * A reusable button component for React applications.
 *
 * @component
 * @param {ButtonProps} props - The properties for the button component.
 * @param {string} props.text - The text to display inside the button.
 * @param {() => void} props.onClick - The callback function to execute when the button is clicked.
 * @param {boolean} [props.disabled] - Optional. If true, the button will be disabled. Defaults to false.
 * @param {string} [props.className] - Optional. Additional CSS class names to apply to the button.
 * @param {React.CSSProperties} [props.styles] - Optional. Inline styles to apply to the button.
 *
 * @returns {JSX.Element} A styled button element.
 *
 * @example
 * <ButtonComp
 *   text="Click Me"
 *   onClick={() => console.log('Button clicked!')}
 *   disabled={false}
 *   className="custom-class"
 *   styles={{ backgroundColor: 'blue', color: 'white' }}
 * />
 */
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
