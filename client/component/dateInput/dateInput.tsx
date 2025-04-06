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
