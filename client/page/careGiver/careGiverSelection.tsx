import React from "react";
import { useNavigate } from "react-router-dom";

import "./careGiver.css";
import ButtonComp from "./../../component/buttonComp/buttonComp";

/**
 * CareGiverSelection component renders a page for selecting or creating a caregiver.
 */
export default function CareGiverSelection() {
  const navigate = useNavigate();

  const mockCaregivers = [
    { id: 1, name: "Anders (Mock Data)" }
  ];

  return (
    <section className="caregiver-section">
      <div className="caregiver-container">
        <div className="caregiver-form">
          <h1 className="caregiver-h1">Välj vårdnadshavare</h1>

          <div className="caregiver-list">
            {mockCaregivers.map((cg) => (
              <ButtonComp
                key={cg.id}
                text={cg.name}
                className="caregiver-select-button"
                onClick={() => {
                  // TODO: Implement caregiver selection logic
                  console.log(`Selected caregiver: ${cg.name}`);
                }}
              />
            ))}
          </div>

          <div className="profile-button-container">
            <ButtonComp
              className="plus-button"
              onClick={() => navigate("/caregiver/create")}
              text="+"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

