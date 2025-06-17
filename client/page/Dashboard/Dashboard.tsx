import React from "react";
import IndividualCard from "../../component/Individual/IndividualCard";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
/**
 * Static list of individuals (mock data).
 * 
 * TODO: Replace with API call in the future.
 */
const individuals = [
  { id: 1, name: "Anders Mock" },
  { id: 2, name: "Sara Mock" }
];

export default function Dashboard() {

  const navigate = useNavigate();
  const handleCreateNew = () => {
    console.log("Skapa ny individ clicked");
    // navigate("/createIndividual");
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






