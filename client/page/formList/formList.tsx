import React from "react";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./formList.css";
import { useNavigate } from "react-router-dom";

/**
 * FormList component shows a list of available forms.
 * Each form will be rendered as a button.
 *
 * TODO: In the future, fetch available forms from backend.
 *
 * @returns {JSX.Element} The rendered form list.
 */
export default function FormList() {
  const navigate = useNavigate();
  const forms = ["Habilitering"];

  return (
    <div>
      <ButtonComp
              key={"back"}
              text="Tillbaka"
              onClick={() => navigate("/dashboard")}
              className="back-button"
            />
    <section className="formlist-section">
      <div className="formlist-container">
        <h1 className="formlist-heading">Välj formulär</h1>
        <div className="formlist-buttons">
          {forms.map((form, index) => (
            <ButtonComp
              key={index}
              text={form}
              onClick={() => navigate("/formPage")}
              className="formlist-button"
            />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
