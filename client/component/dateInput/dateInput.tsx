import React from "react";
import "./dateInput.css";

type DateInputProps = {
  text: string;
  value: Date;
  onChange: (value: Date) => void;
  disabled?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

/**
 * A React component for rendering a date input field with customizable styles and behavior.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.text - The label text displayed above the date input field.
 * @param {Date} props.value - The current value of the date input field.
 * @param {(value: Date) => void} props.onChange - Callback function triggered when the date value changes.
 * @param {boolean} [props.disabled] - Optional. If true, disables the date input field. Defaults to false.
 * @param {string} [props.className] - Optional. Additional CSS class names to apply to the container.
 * @param {React.CSSProperties} [props.styles] - Optional. Inline styles to apply to the container.
 *
 * @returns {JSX.Element} A styled date input field with a label.
 *
 * @example
 * <DateInput
 *   text="Select a date"
 *   value={new Date()}
 *   onChange={(newDate) => console.log(newDate)}
 *   disabled={false}
 *   className="custom-class"
 *   styles={{ margin: "10px" }}
 * />
 */
export default function DateInput(props: DateInputProps) {
  const { text, value, onChange, disabled, className, styles } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(new Date(event.target.value));
    }
  };

  return (
    <div className={`date-input-container ${className || ""}`} style={styles}>
      <label className="date-input-label">{text}</label>
      <input
        type="date"
        value={value ? value.toISOString().split("T")[0] : ""}
        onChange={handleChange}
        disabled={disabled}
        className="date-input-field"
        onClick={(e) => {
          e.currentTarget.showPicker();
        }}
      />
    </div>
  );
}
