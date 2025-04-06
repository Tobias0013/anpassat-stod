import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css";
import TextInput from "./../../component/textInput/textInput";
import ButtonComp from "./../../component/buttonComp/buttonComp";

/**
 * LoginPage component renders a login form for user authentication.
 *
 * @returns {JSX.Element} The rendered login page component.
 *
 * @remarks
 * This component uses React hooks for state management and navigation.
 * It handles form submission, validates input fields, and displays error messages.
 *
 * @example
 * ```
 * retrun (
 *   return <LoginPage />;
 * )
 * ```
 *
 * @throws {Error} If login fails, an error message is set.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onFormSubmit = async () => {
    setErrorMessage("");

    if (email === "" || password === "") {
      setErrorMessage("Fyll i alla fält");
      return;
    } else if (!email.includes("@")) {
      setErrorMessage("Ogiltig e-postadress");
      return;
    }
    //TODO: Add login logic here when backend is ready
    console.log("Email:", email);
    console.log("Password", password);
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-form">
          <h1 className="auth-h1">Logga in</h1>

          <TextInput
            type="email"
            placeholder="E-post"
            onChange={setEmail}
            value={email}
            className="auth-text-input"
          />

          <TextInput
            type="password"
            placeholder="Lösenord"
            onChange={setPassword}
            value={password}
            className="auth-text-input"
          />

          <p className="error-message">{errorMessage}</p>
          <div className="auth-btn-container">
            <ButtonComp
              className="auth-btn alt"
              onClick={() => {
                navigate("/register");
              }}
              text="Registrera"
            />

            <ButtonComp
              className="auth-btn"
              onClick={onFormSubmit}
              text="Logga in"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
