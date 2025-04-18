// Author: Tobias Vinblad
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css";
import {
  getPasswordStrength,
  validPassowrd,
} from "../../controller/passwordChecker";
import TextInput from "./../../component/textInput/textInput";
import ButtonComp from "./../../component/buttonComp/buttonComp";

/**
 * RegisterPage component allows users to register by providing a username, password, and an optional admin status.
 * It includes form validation and password strength checking.
 *
 * @example
 * return (
 *   <RegisterPage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @throws {Error} If login fails, an error message is set.
 */

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [strengthText, setStrengthText] = useState<string>("");
  const [strengthColor, setStrengthColor] = useState<string>("");

  const onFormSubmit = async () => {
    setErrorMessage("");

    if (email === "" || password === "") {
      setErrorMessage("Fyll i alla fält");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Ogiltig e-postadress");
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Lösenorden matchar inte");
      return;
    } else if (!validPassowrd(password)) {
      setErrorMessage("Lösenordet är för svagt");
      return;
    }
    //TODO: Add register logic here when backend is ready
    console.log("Email:", email);
    console.log("Password", password);
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    const strength = getPasswordStrength(value);
    setStrengthText(`Password strength: ${strength.value}`);
    if (strength.id == 0) {
      setStrengthColor("#DC143C");
    }
    if (strength.id == 1) {
      setStrengthColor("#FF8C00");
    }
    if (strength.id == 2) {
      setStrengthColor("#FFFF00");
    }
    if (strength.id == 3) {
      setStrengthColor("#008000");
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-form">
          <h1 className="auth-h1">Registrera</h1>

          <TextInput
            type="email"
            placeholder="E-post"
            onChange={setEmail}
            value={email}
            className="auth-text-input"
          />

          <p style={{ fontSize: "1.75rem", color: strengthColor }}>
            {strengthText}
          </p>

          <TextInput
            type="password"
            placeholder="Lösenord"
            onChange={onPasswordChange}
            value={password}
            className="auth-text-input"
          />

          <TextInput
            type="password"
            placeholder="Bekräfta lösenord"
            onChange={setConfirmPassword}
            value={confirmPassword}
            className="auth-text-input"
          />

          <p className="error-message">{errorMessage}</p>
          <div className="auth-btn-container">
            <ButtonComp
              className="auth-btn alt"
              onClick={() => {
                navigate("/login");
              }}
              text="Logga in"
            />

            <ButtonComp
              className="auth-btn"
              onClick={onFormSubmit}
              text="Registrera"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
