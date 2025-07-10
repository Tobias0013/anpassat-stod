import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../auth/auth.css"; // Reuse same CSS for consistent styling
import TextInput from "../../component/textInput/textInput";
import ButtonComp from "../../component/buttonComp/buttonComp";
import CheckBox from "../../component/CheckBox/CheckBox";
import { createIndividualAPI } from "../../controller/individualsController";

/**
 * CreateIndividualPage component allows creation of a new individual
 * by collecting basic personal details.
 *
 * Fields:
 * - Namn
 * - Ålder
 * - Kommun
 * - Kön (Man, Kvinna, Inget)
 *
 * TODO: Connect this form to a backend API when available.
 *
 * @example
 * return (
 *   <CreateIndividualPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */

export default function CreateIndividualPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [municipality, setMunicipality] = useState("");

  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [isNone, setIsNone] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const onFormSubmit = async () => {
    setErrorMessage("");
  
    if (!name || !age || !municipality || (!isMale && !isFemale && !isNone)) {
      setErrorMessage("Fyll i alla fält");
      return;
    }
  
    const gender: "male" | "female" | "none" = isMale ? "male" : isFemale ? "female" : "none";
  
    const individualData = {
      name,
      age: parseInt(age),
      county: municipality,
      gender,
    };
  
    try {
      const newIndividual = await createIndividualAPI(individualData);
      console.log("Individual created:", newIndividual);
      navigate("/dashboard"); // or wherever you want to redirect
    } catch (err: any) {
      console.error("Failed to create individual:", err.message);
      setErrorMessage(err.message || "Något gick fel");
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-form">
          <h1 className="auth-h1">Ny individ</h1>

          <TextInput
            type="text"
            placeholder="Namn"
            onChange={setName}
            value={name}
            className="auth-text-input"
          />

          <TextInput
            type="number"
            placeholder="Ålder"
            onChange={setAge}
            value={age}
            className="auth-text-input"
          />

          <TextInput
            type="text"
            placeholder="Kommun"
            onChange={setMunicipality}
            value={municipality}
            className="auth-text-input"
          />

          <div className="auth-checkbox-container">
            <CheckBox
              checked={isMale}
              label="Man"
              onChange={() => {
                setIsMale(true);
                setIsFemale(false);
                setIsNone(false);
              }}
            />
            <CheckBox
              checked={isFemale}
              label="Kvinna"
              onChange={() => {
                setIsMale(false);
                setIsFemale(true);
                setIsNone(false);
              }}
            />
            <CheckBox
              checked={isNone}
              label="Inget"
              onChange={() => {
                setIsMale(false);
                setIsFemale(false);
                setIsNone(true);
              }}
            />
          </div>

          <p className="error-message">{errorMessage}</p>

          <div className="auth-btn-container">
            <ButtonComp
              className="auth-btn alt"
              onClick={() => navigate(-1)}
              text="Tillbaka"
            />
            <ButtonComp
              className="auth-btn"
              onClick={onFormSubmit}
              text="Skapa"
            />
          </div>
        </div>
      </div>
    </section>
  );
}