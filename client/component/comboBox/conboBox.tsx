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
