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
    try {
      const individualId = localStorage.getItem("individualId");
      const token = localStorage.getItem("token");
  
      if (!individualId || !token) {
        alert("Missing authentication info. Please log in again.");
        return;
      }
  
      const formId = `form_${Date.now()}`;
  
      const payload = {
        formId,
        type: "habilitering",
        individualId,
        answers: allAnswers
      };
  
      const result = await submitFormToBackend(payload);
  
      if (!result) {
        console.error("No response received from backend.");
        return;
      }
  
      console.log(result.message);       // Shows "Form created"
      console.log("Form data:", result.form);
      alert(result.message);             // Visar popup till användaren
  
      navigate("/formList");
    } catch (error: any) {
      console.error(error);
      alert("Error submitting form: " + error.message);
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
