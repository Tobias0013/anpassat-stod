import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./formPage.css";

import CheckBox from "../../component/CheckBox/CheckBox";
import ComboBox from "../../component/comboBox/comboBox";
import DateInput from "../../component/dateInput/dateInput";
import Slider from "../../component/Slider/Slider";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";

import { questions, answers, futureOptions } from "./habiliteringsQuestions";

/**
 * This page renders one form question at a time from the Habilitering form.
 * All user inputs are stored locally in state.
 * 
 * In the future, responses will be sent to the backend.
 */
export default function FormPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form state
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

  /**
   * Placeholder function for saving the current form answers to the database.
   * 
   * TODO: In the future, connect this function to ourbackend API.
   */
  const saveAnswersToDB = () => {
    const answerData = {
      question: questions[currentIndex],
      needNo,
      futureNeed,
      futureNeedDate,
      needYes,
      urgency,
      appliedYes,
      appliedDate,
      grantedYes,
      grantedDate,
      standardNo,
      feedback
    };

    console.log("Saving to DB (simulated):", answerData);
    // TODO: POST this data to backend
  };

  /**
   * Resets all input fields for the next question.
   * This ensures the user starts with a clean state each time.
   */
  const resetAnswers = () => {
    setNeedNo(false);
    setFutureNeed(false);
    setFutureNeedDate(futureOptions[0]);

    setNeedYes(false);
    setUrgency(3);
    setAppliedYes(false);
    setAppliedDate(new Date());

    setGrantedYes(false);
    setGrantedDate(new Date());

    setStandardNo(false);
    setFeedback("");
  };

  const next = () => {
    saveAnswersToDB();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetAnswers(); // Clear previous inputs
    } else {
      console.log("All questions answered. Submitting form...");
      navigate("/formList");
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetAnswers(); // Optional: also reset if going back
    }
  };

  return (
    <section className="form-section">
      <div className="form-container">
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
