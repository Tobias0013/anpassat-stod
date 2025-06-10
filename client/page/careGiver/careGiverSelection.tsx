import React from "react";
import { useNavigate } from "react-router-dom";

import "./careGiver.css";
import ButtonComp from "./../../component/buttonComp/buttonComp"; 

/**
 * CareGiverSelection component renders a page for selecting or creating a caregiver.
 *
 * @returns {JSX.Element} The rendered caregiver selection page.
 *
 * @remarks
 * This component provides a button that navigates to the caregiver creation page.
 * It uses React hooks for navigation and manages user interaction for caregiver selection.
 * 
 * @example
 * ```
 * return <CareGiverSelection />;
 * ```
 *
 * @throws {Error} If navigation fails, an error may be thrown (though unlikely with react-router).
 * @note
 * The button's onClick handler can be extended to include additional logic for caregiver selection.
 */


// TODO: Fetch and display all caregivers associated with the current account.
export default function CareGiverSelection() {
  const navigate = useNavigate();

  return (
    <section className="caregiver-section">
      <div className="caregiver-container">
        <div className="caregiver-form">
          <h1 className="caregiver-h1">Välj vårdnadshavare</h1>
          <div className="profile-button-container">
            {}
            <ButtonComp
              className="plus-button" 
              onClick={() => {
                console.log("Plus button clicked");
                navigate("/caregiver/create");
              }}
              text="+"
            />
          </div>
        </div>
      </div>
    </section>
  );
}