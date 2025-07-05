import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css";
import TextInput from "./../../component/textInput/textInput";
import ButtonComp from "./../../component/buttonComp/buttonComp";
import { loginUser } from "../../controller/authcontroller";

/**
 * LoginPage component renders a login form for user authentication.
 * It includes input validation, client-side encryption of credentials,
 * and handles JWT-based login through the backend.
 *
 * On successful login, the JWT token is stored in localStorage and the user
 * is redirected to the dashboard.
 *
 * @example
 * return (
 *   <LoginPage />
 * )
 *
 * @returns {JSX.Element} The rendered login page component.
 *
 * @throws {Error} If login fails or the server returns an error, a message is displayed.
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
    //Login logic
    try {
      const result = await loginUser(email, password);
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        setErrorMessage(result.message || "Fel vid inloggning");
      }
    } catch (err) {
      setErrorMessage("Internal Server Error");
    }
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
