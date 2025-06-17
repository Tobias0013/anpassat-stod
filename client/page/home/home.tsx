import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import ButtonComp from "../../component/buttonComp/buttonComp";

/**
 * HomePage component represents the landing page of the application.
 * 
 * 
 * It displays:
 * - A welcome headline
 * - A list of the application's core purposes
 * - Instructional text for users
 * - A "Kom igång" button that navigates to the login page
 *  
 * @component
 * @returns {JSX.Element} The rendered homepage component.
 */
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="home-section">
      <div className="home-container">
        <h1 className="home-heading">Välkommen till Anpassat Stöd</h1>

        <ul className="home-goals">
          <li>Förbättra vardagen för familjer eller individer med funktionsnedsättning</li>
          <li>Förenkla för familjer eller individer i behov att få rätt hjälp</li>
          <li>Ge familjer eller individer vägledning och information om möjlig hjälp att få</li>
        </ul>

        <p className="home-instruction">
          Logga in för att hantera användare, fylla i formulär eller få överblick över stödinsatser.
        </p>

        <div className="home-button-wrapper">
          <ButtonComp
            text="Kom igång"
            onClick={() => navigate("/login")}
            className="home-start-button"
          />
        </div>
      </div>
    </section>
  );
}
