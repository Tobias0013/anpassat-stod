import React from 'react';
import './CheckBox.css';

type CheckBoxProps = {
  /**
   * Whether the checkbox is currently checked.
   */
  checked: boolean;

  /**
   * Optional class name to customize styles.
   */
  className?: string;

  /**
   * Optional ID for accessibility or linking with a label.
   */
  id?: string;

  /**
   * Optional label to display next to the checkbox.
   */
  label?: string;

  /**
   * Callback fired when the checkbox is toggled.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * A reusable checkbox component.
 *
 * @param {CheckBoxProps} props - Props for the checkbox component.
 * @param {boolean} props.checked - Whether the checkbox is checked.
 * @param {string} [props.className] - Optional class name for styling.
 * @param {string} [props.id] - Optional ID for the checkbox element.
 * @param {string} [props.label] - Optional label displayed next to the checkbox.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Handler when the checkbox is toggled.
 * @returns {JSX.Element} A checkbox input with optional label.
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  className = '',
  id,
  label,
  onChange
}) => {
  return (
    <label className={`checkbox-wrapper ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="checkbox"
      />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default CheckBox;
