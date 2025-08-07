import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./formPage.css";

import CheckBox from "../../component/CheckBox/CheckBox";
import ComboBox from "../../component/comboBox/comboBox";
import DateInput from "../../component/dateInput/dateInput";
import Slider from "../../component/Slider/Slider";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";

import { submitFormToBackend, FormAnswer } from "../../controller/formController";
import { questions, answers, futureOptions } from "./habiliteringsQuestions";

/**
 * FormPage component handles a multi-step form submission flow for a habilitering form.
 * It dynamically renders form questions, manages local and global answer states,
 * and sends the compiled responses to the backend API on completion.
 * 
 * Features:
 * - Step-by-step question navigation with conditional inputs
 * - Local state handling for checkboxes, sliders, dates, and text areas
 * - Final submission via `submitFormToBackend` with success/failure feedback
 * - Displays inline success/error messages in a user-friendly format
 * 
 * State Managed:
 * - `allAnswers`: Stores all answers across form steps
 * - `currentIndex`: Tracks the current step/question
 * - Field-specific states: like `needYes`, `urgency`, `appliedYes`, etc.
 * 
 * Behavior:
 * - Users move forward using "Nästa" or "Färdig" (last step triggers submit)
 * - On successful submission, shows "Formulär sparat!" and redirects to /dashboard
 * - On failure, displays a meaningful error message
 * 
 * @returns {JSX.Element} The rendered habilitering form page
 */

export default function FormPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Global answer state
  const [allAnswers, setAllAnswers] = useState<FormAnswer[]>([]);

  // Local question state
  const [needNo, setNeedNo] = useState(false);
  const [futureNeed, setFutureNeed] = useState(false);
  const [futureNeedDate, setFutureNeedDate] = useState(futureOptions[0]);

  const [needYes, setNeedYes] = useState(false);
  const [urgency, setUrgency] = useState(3);
  const [appliedYes, setAppliedYes] = useState(false);
  const [appliedDate, setAppliedDate] = useState<Date>(new Date());

  const [grantedYes, setGrantedYes] = useState(false);
  const [grantedDate, setGrantedDate] = useState<Date>(new Date());

  const [standardNo, setStandardNo] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetAnswers = () => {
    setNeedNo(false);
    setFutureNeed(false);
    setFutureNeedDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString());

    setNeedYes(false);
    setUrgency(3);
    setAppliedYes(false);
    setAppliedDate(new Date());

    setGrantedYes(false);
    setGrantedDate(new Date());

    setStandardNo(false);
    setFeedback("");
  };

  const saveCurrentAnswer = () => {
    const answer: FormAnswer = {
      id: currentIndex,
      need: needYes || needNo,
      futureNeed,
      futureNeedDate: futureNeed ? futureNeedDate : null,
      priority: urgency,
      applied: appliedYes,
      appliedDate: appliedYes ? appliedDate.toISOString() : null,
      granted: grantedYes,
      grantedDate: grantedYes ? grantedDate.toISOString() : null,
      fitmentStandard: !standardNo,
      feedback: standardNo ? feedback : ""
    };

    setAllAnswers(prev => {
      const updated = [...prev];
      updated[currentIndex] = answer;
      return updated;
    });
  };

  const submitForm = async () => {
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const individualId = localStorage.getItem("individualId");
      const token = localStorage.getItem("token");
  
      if (!individualId || !token) {
        setErrorMessage("Saknar autentisering. Logga in igen.");
        return;
      }
  
      const formId = `form_${Date.now()}`;
  
      const payload = {
        formId,
        type: "habilitering",
        individualId,
        answers: allAnswers,
      };
  
      const result = await submitFormToBackend(payload);
  
      if (!result) {
        setErrorMessage("Inget svar från servern.");
        return;
      }
  
      setSuccessMessage("Formulär sparat!");
  
      // Navigate after short delay
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Fel vid formulärinlämning: " + error.message);
    }
  };
  

  const next = () => {
    saveCurrentAnswer();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      resetAnswers();
    } else {
      submitForm();
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      resetAnswers(); 
    }
  };

  return (
    <section className="form-section">
      <div className="form-container">
      {errorMessage && <p className="form-error-message">{errorMessage}</p>}
      {successMessage && <p className="form-success-message">{successMessage}</p>}
        <div className="form-form">
          <h1 className="form-h1">Fråga {currentIndex + 1} av {questions.length}</h1>
          <h2 className="form-h2">{questions[currentIndex]}</h2>

          <div className="form-checkbox-container">
            <CheckBox
              label={answers[0]}
              checked={needNo}
              onChange={() => setNeedNo(!needNo)}
            />
          </div>

          {needNo && (
            <div className="form-indent">
              <CheckBox
                label={answers[1]}
                checked={futureNeed}
                onChange={() => setFutureNeed(!futureNeed)}
              />
              {futureNeed && (
                <ComboBox
                  text={answers[2]}
                  options={futureOptions}
                  value={futureNeedDate}
                  onChange={setFutureNeedDate}
                />
              )}
            </div>
          )}

          <CheckBox
            label={answers[3]}
            checked={needYes}
            onChange={() => setNeedYes(!needYes)}
          />

          {needYes && (
            <>
              <h3 className="form-subtitle">Hur akut är behovet?</h3>
              <Slider
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
              />

              <CheckBox
                label={answers[4]}
                checked={!appliedYes}
                onChange={() => setAppliedYes(false)}
              />
              <CheckBox
                label={answers[5]}
                checked={appliedYes}
                onChange={() => setAppliedYes(true)}
              />
            </>
          )}

          {needYes && appliedYes && (
            <DateInput
              text={answers[2]}
              value={appliedDate}
              onChange={setAppliedDate}
            />
          )}

          {needYes && appliedYes && appliedDate && (
            <>
              <CheckBox
                label={answers[6]}
                checked={!grantedYes}
                onChange={() => setGrantedYes(false)}
              />
              <CheckBox
                label={answers[7]}
                checked={grantedYes}
                onChange={() => setGrantedYes(true)}
              />
            </>
          )}

          {grantedYes && (
            <DateInput
              text={answers[2]}
              value={grantedDate}
              onChange={setGrantedDate}
            />
          )}

          {grantedYes && grantedDate && (
            <>
              <CheckBox
                label={answers[8]}
                checked={standardNo}
                onChange={() => setStandardNo(!standardNo)}
              />
              {standardNo && (
                <TextArea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={answers[9]}
                />
              )}
              <CheckBox
                label={answers[10]}
                checked={!standardNo}
                onChange={() => setStandardNo(false)}
              />
            </>
          )}

          <div className="form-btn-container">
            <ButtonComp className="form-btn alt" text="Föregående" onClick={prev} />
            <ButtonComp
              className="form-btn"
              text={currentIndex === questions.length - 1 ? "Färdig" : "Nästa"}
              onClick={next}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
