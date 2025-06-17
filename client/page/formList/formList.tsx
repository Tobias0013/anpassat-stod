import React from "react";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./formList.css";

/**
 * FormList component shows a list of available forms.
 * Each form will be rendered as a button.
 *
 * TODO: In the future, fetch available forms from backend.
 *
 * @returns {JSX.Element} The rendered form list.
 */
export default function FormList() {
  // Placeholder form list
  const forms = ["Habilitering"];

  return (
    <section className="formlist-section">
      <div className="formlist-container">
        <h1 className="formlist-heading">Välj formulär</h1>
        <div className="formlist-buttons">
          {forms.map((form, index) => (
            <ButtonComp
              key={index}
              text={form}
              onClick={() => console.log(`Valt formulär: ${form}`)}
              className="formlist-button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
