import React from 'react';
import './textArea.css';

type TextAreaProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

/**
 * A reusable, auto-expanding text area component.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string} props.value - The current value of the text area.
 * @param {(event: React.ChangeEvent<HTMLTextAreaElement>) => void} props.onChange - Handler function when the value changes.
 * @param {string} [props.placeholder] - Optional placeholder text.
 * @param {string} [props.id] - Optional ID for the text area.
 * @param {string} [props.className] - Optional class name for styling overrides.
 * @returns {JSX.Element} A styled, auto-expanding textarea element.
 */
const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = '',
  id,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto'; // Reset height
    el.style.height = `${el.scrollHeight}px`; // Adjust height to content
    onChange(e);
  };

  return (
    <textarea
      id={id}
      className={`text-input ${className}`}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={1}
    />
  );
};

export default TextArea;

