import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndividualCard from "../../component/Individual/IndividualCard";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./Dashboard.css";
import { fetchAccountIndividuals } from "../../controller/accountController";

/**
 * Dashboard component displays individuals associated with the current account.
 * Fetches data from backend using JWT stored in localStorage.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [individuals, setIndividuals] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIndividuals = async () => {
      try {
        const data = await fetchAccountIndividuals();
        console.log("Fetched individuals:", data);
        setIndividuals(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching individuals:", err.message);
        setError(err.message || "Failed to load individuals");
        setIndividuals([]); // fallback to empty array
      }
    };

    loadIndividuals();
  }, []);

  const handleCreateNew = () => {
    navigate("/createIndividual");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        <div className="create-button-wrapper">
          <ButtonComp
            text="Skapa ny individ +"
            onClick={handleCreateNew}
            className="create-button"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        {Array.isArray(individuals) && individuals.length === 0 && !error && (
          <p className="info-message">Du har ännu inga individer kopplade till detta konto.</p>
        )}

        {Array.isArray(individuals) &&
          individuals.map((person) => (
            <div className="individual-section" key={person._id}>
              <div className="individual-card-wrapper">
                <IndividualCard name={person.name} />
              </div>
              <div className="individual-description">
                {/* Details like age, gender, county can go here later */}
              </div>
              <div className="button-stack">
              <ButtonComp
  text="Formulär"
  onClick={() => {
    localStorage.setItem("individualId", person._id);
    navigate("/formList");
   }}
                    />
                <ButtonComp text="Resultat" onClick={() => console.log(`${person.name}: Resultat`)} />
                <ButtonComp text="Att göra" onClick={() => console.log(`${person.name}: Att göra`)} />
                <ButtonComp text="Dagens händelse" onClick={() => navigate("/eventOfTheDay")} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
