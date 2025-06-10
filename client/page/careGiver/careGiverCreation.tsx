import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./careGiver.css";
import TextInput from "./../../component/textInput/textInput"; 
import ButtonComp from "./../../component/buttonComp/buttonComp";
import { createCaregiver } from "../../controller/createCareGiver"; 

/**
 * CareGiverCreation component renders a form for creating a new caregiver.
 *
 * @returns {JSX.Element} The rendered caregiver creation page.
 *
 * @remarks
 * This component manages form state for caregiver name and county, handles form validation,
 * and calls the createCaregiver API utility to persist data.
 * It uses React hooks for state management and react-router's useNavigate for navigation.
 * 
 * @example
 * ```
 * return <CareGiverCreation />;
 * ```
 *
 * @throws {Error} When API call fails, an error message is displayed to the user.
 * @note
 * In production, ensure that createCaregiver uses environment variables for API URLs
 * to facilitate dynamic configuration based on environment.
 */
export default function CareGiverCreation() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [county, setCounty] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // To show styled error messages

  const handleSave = async () => {
    if (name.trim() === "" || county.trim() === "") {
      setErrorMsg("Vänligen fyll i både namn och län");
      return;
    }

    try {
      // Call the API utility
      await createCaregiver(name, county);
      // Clear error message on success
      setErrorMsg("");
      // Navigate back
      navigate("/caregiver");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Ett fel uppstod, försök igen");
    }
  };

  return (
    <section className="caregiver-section">
      <div className="caregiver-container">
        <h1 className="caregiver-h1">Skapa Vårdnadshavare</h1>
        <div className="caregiver-form">
          <TextInput
            type="text"
            placeholder="Namn"
            value={name}
            onChange={setName}
            className="caregiver-text-input"
          />
          <TextInput
            type="text"
            placeholder="Kommun"
            value={county}
            onChange={setCounty}
            className="caregiver-text-input"
          />
          {errorMsg && <p className="error-message">{errorMsg}</p>}
        </div>
        <div className="caregiver-btn-container">
          <ButtonComp
            className="caregiver-save-btn"
            onClick={handleSave}
            text="Spara"
          />
        </div>
      </div>
    </section>
  );
}