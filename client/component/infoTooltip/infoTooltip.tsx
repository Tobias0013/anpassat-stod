import React, { useState } from "react";
import "./infoTooltip.css";

type InfoTooltipProps = {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
};

/**
 * InfoTooltip component displays a small info icon (ℹ️) that shows
 * a tooltip with explanatory text on hover or click.
 *
 * @param text - The explanation text to display in the tooltip
 * @param position - Where the tooltip should appear relative to the icon (default: "top")
 */
export default function InfoTooltip({ text, position = "top" }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-container">
      <button
        className="info-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Visa förklaring"
        type="button"
      >
        ℹ️
      </button>
      {isVisible && (
        <div className={`info-tooltip info-tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
}
