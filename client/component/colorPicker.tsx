import React from "react";
import { useState } from "react";

/**
 * A React functional component that allows users to pick a color.
 * 
 * This component displays a heading that changes color when a button is clicked.
 * 
 * @returns {React.ReactNode} The rendered component.
 * 
 * @example
 * // Usage example:
 * // <ColorPicker />
 * 
 */
export default function ColorPicker() {
  const [color, setColor] = useState("");

  return (
    <>
      <h1 style={{ color: color }}>My favorite color is: {color}</h1>
      <button type="button" onClick={() => setColor("blue")}>
        Blue
      </button>
      <button type="button" onClick={() => setColor("red")}>
        Red
      </button>
      <button type="button" onClick={() => setColor("pink")}>
        Pink
      </button>
      <button type="button" onClick={() => setColor("green")}>
        Green
      </button>
    </>
  );
}
