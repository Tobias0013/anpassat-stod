import React from "react";
import IndividualCard from "../../component/Individual/IndividualCard";
import ButtonComp from "../../component/buttonComp/buttonComp";
import "./Dashboard.css";

/**
 * Static list of individuals (mock data).
 * 
 * TODO: Replace with API call in the future.
 */
const individuals = [
  { id: 1, name: "Anders Mock" },
  { id: 2, name: "Sara Mock" },
  { id: 3, name: "Erik Mock" },
];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {individuals.map((person) => (
        <div className="individual-section" key={person.id}>
          {/* Individual's avatar or label */}
          <div className="individual-card-wrapper">
            <IndividualCard name={person.name} />
          </div>

          {/* Action buttons for the individual */}
          <div className="button-stack">
            <ButtonComp
              text="Enkäter"
              onClick={() => console.log(`${person.name}: Enkäter`)}
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
              onClick={() => console.log(`${person.name}: Dagens händelse`)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}






