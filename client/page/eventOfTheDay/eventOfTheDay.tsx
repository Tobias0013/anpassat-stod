import React, { useState } from "react";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp"; 
import "./eventOfTheDay.css";

const EventOfTheDay: React.FC = () => {
  const [text, setText] = useState("");

  /**
   * Handles the click event when the user clicks the "Spara" button.
   *
   * @returns {void}
   *
   * @remarks
   * This function will eventually save the event text to a database.
   * Currently, it only logs the text to the console.
   *
   * @todo
   * Integrate with backend or local storage to persist the event.
   * Add so that you can save the document as a PDF
   *
   */
  const handleClick = () => {
    console.log("Spara klickad:", text);
  };

  return (
    <div className="event-section">
      <div className="event-container">
        <h1 className="event-heading">Dagens händelse</h1>
        <div className="event-form">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Vad hände idag?"
            className="event-textarea"
          />
          <ButtonComp text="Spara" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default EventOfTheDay;

