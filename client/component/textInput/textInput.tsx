import React from "react";
import "./textInput.css";

type TextInputProps = {
  type: "text" | "number" | "password" | "email" | "url" | "tel" | "search";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  styles?: React.CSSProperties;
};

export default function TextInput(props: TextInputProps) {
  const { type, value, onChange, placeholder, disabled, className, styles } =
    props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <input
      className={`text-input ${className}`}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      style={styles}
    />
  );
}
