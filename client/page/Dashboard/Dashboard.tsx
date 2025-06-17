import React from "react";
import IndividualCard from "../../component/Individual/IndividualCard";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

/**
 * Static list of individuals (mock data).
 *
 * TODO: Replace with real API call to fetch individuals from the backend.
 */
const individuals = [
  {
    id: 1,
    name: "Olle Mock",
    age: 14,
    municipality: "Stockholm",
    gender: "Man",
  },
  {
    id: 2,
    name: "Sara Mock",
    age: 10,
    municipality: "Göteborg",
    gender: "Kvinna",
  },
];
export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    console.log("Skapa ny individ clicked");
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

        {individuals.map((person) => (
          <div className="individual-section" key={person.id}>
            <div className="individual-card-wrapper">
              <IndividualCard name={person.name} />
            </div>

            {/* Placeholder info – to be replaced with real data from backend */}
            <div className="individual-description">
            <p><span className="label">Ålder:</span> {person.age}</p>
            <p><span className="label">Kommun:</span> {person.municipality}</p>
            <p><span className="label">Kön:</span> {person.gender}</p>
            </div>

            <div className="button-stack">
              <ButtonComp
                text="Forumlär"
                onClick={() => console.log(`${person.name}: Forumlär`)}
              />
              <ButtonComp
                text="Resultat"
                onClick={() => console.log(`${person.name}: Resultat`)}
              />
              <ButtonComp
                text="Att göra"
                onClick={() => console.log(`${person.name}: Att göra`)}
              />
              <ButtonComp
                text="Dagens händelse"
                onClick={() => navigate("/eventOfTheDay")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



