import React from "react";
import "./comboBox.css";

type ComboBoxProps = {
  text: string;
  options: string[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

/**
 * A reusable ComboBox component that renders a dropdown menu with customizable options.
 *
 * @param {ComboBoxProps} props - The properties for the ComboBox component.
 * @param {string} props.text - The label text displayed above the dropdown.
 * @param {string[]} props.options - An array of string options to populate the dropdown.
 * @param {(value: string) => void} props.onChange - Callback function triggered when the selected value changes.
 * @param {string} [props.value] - The currently selected value (optional).
 * @param {string} [props.placeholder] - Placeholder text displayed as the default option (optional).
 * @param {boolean} [props.disabled] - Whether the dropdown is disabled (optional).
 * @param {string} [props.className] - Additional CSS class names for the component (optional).
 * @param {React.CSSProperties} [props.styles] - Inline styles for the component (optional).
 *
 * @returns {JSX.Element} The rendered ComboBox component.
 * 
 * @example
 * <ComboBox
 *   text="Select an option" 
 *  options={["Option 1", "Option 2", "Option 3"]}
 *  onChange={(value) => console.log(value)}
 *  placeholder="Choose an option"
 *  disabled={false}
 *  className="custom-combobox"
 *  styles={{ backgroundColor: "lightgray" }}
 * />
 */
export default function ComboBox(props: ComboBoxProps) {
  const { text, options, placeholder, onChange, disabled, className, styles } =
    props;

  const onChangeOption = (value: string) => {
    onChange(value);
    console.log(value);
  };

  return (
    <div className={`combo-box-container ${className || ""}`} style={styles}>
      <label className="combo-box-label">{text}</label>
      <select
        className="combo-box-select"
        onChange={(e) => onChangeOption(e.target.value)}
        disabled={disabled}
        defaultValue={placeholder ? placeholder : options[0]}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
