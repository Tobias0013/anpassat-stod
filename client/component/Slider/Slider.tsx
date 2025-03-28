import React from 'react';
import './Slider.css';

type SliderProps = {
  /**
   * The current value of the slider (1 to 5).
   */
  value: number;

  /**
   * Handler for when the slider value changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Optional label for accessibility or display.
   */
  label?: string;

  /**
   * Optional id for the slider input.
   */
  id?: string;

  /**
   * Optional class name for custom styling.
   */
  className?: string;
};

/**
 * A reusable slider component with 5 discrete steps.
 *
 * @param {SliderProps} props - Props for the slider component.
 * @param {number} props.value - Current value of the slider (0–4).
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Change handler.
 * @param {string} [props.label] - Optional label displayed above the slider.
 * @param {string} [props.id] - Optional ID for the input element.
 * @param {string} [props.className] - Optional class name for styling.
 * @returns {JSX.Element} A styled range slider input.
 */
const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  label,
  id,
  className = ''
}) => {
  return (
    <div className={`slider-wrapper ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="range"
        id={id}
        min={0}
        max={4}
        step={1}
        value={value}
        onChange={onChange}
        className="slider"
      />
    </div>
  );
};

export default Slider;
