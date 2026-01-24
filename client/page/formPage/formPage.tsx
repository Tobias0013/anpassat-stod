import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./formPage.css";

import CheckBox from "../../component/CheckBox/CheckBox";
import ComboBox from "../../component/comboBox/comboBox";
import DateInput from "../../component/dateInput/dateInput";
import Slider from "../../component/Slider/Slider";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";
import InfoTooltip from "../../component/infoTooltip/infoTooltip";

import { submitFormToBackend, FormAnswer } from "../../controller/formController";
import { questions, answers, futureOptions, explanations } from "./habiliteringsQuestions";
import { set } from "mongoose";       

/**
 * FormPage component handles a multi-step form submission flow for a habilitering form.
 * It dynamically renders form questions, manages local and global answer states,
 * and sends the compiled responses to the backend API on completion.
  */
export default function FormPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Global answers for ALL questions
  const [allAnswers, setAllAnswers] = useState<FormAnswer[]>([]);

  // Local UI state for the CURRENT question
  const [needNo, setNeedNo] = useState(false);
  const [needYes, setNeedYes] = useState(false);

  const [futureNeed, setFutureNeed] = useState(false);
  const [futureNeedDate, setFutureNeedDate] = useState<string | null>(futureOptions[0] ?? null);
  const [urgency, setUrgency] = useState(3);

  const [appliedYes, setAppliedYes] = useState(false);
  const [appliedDate, setAppliedDate] = useState<Date>(new Date());

  const [grantedYes, setGrantedYes] = useState(false);
  const [grantedDate, setGrantedDate] = useState<Date>(new Date());

  const [deniedYes, setDeniedYes] = useState(true);
  const [deniedDate, setDeniedDate] = useState<Date | null>(null);

  const [standardNo, setStandardNo] = useState(false); // "uppfyller inte standard"
  const [feedback, setFeedback] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /** Hjälpfunktion: ladda defaults för ny fråga */
  const loadDefaultsForQuestion = () => {
    setNeedNo(false);
    setNeedYes(false);
    setFutureNeed(false);
    setFutureNeedDate(futureOptions[0] ?? null);
    setUrgency(3);
    setAppliedYes(false);
    setAppliedDate(new Date());
      setGrantedYes(false);
      setGrantedDate(new Date());
      setDeniedYes(false);
      setDeniedDate(new Date());
    setStandardNo(true);
    setFeedback("");
  };

  /** Spara nuvarande frågas svar in i allAnswers[currentIndex] */
  const saveCurrentAnswer = () => {
    const answer: FormAnswer = {
      id: currentIndex,
      // Tydlig tolkning: needYes => true, needNo => false, annars false
      need: needYes ? true : needNo ? false : false,
      futureNeed,
      futureNeedDate: futureNeed ? futureNeedDate : null,
      priority: urgency,
      applied: appliedYes,
      appliedDate: appliedYes ? appliedDate.toISOString() : null,
      granted: grantedYes,
      grantedDate: grantedYes ? grantedDate.toISOString() : null,
      denied: appliedYes ? !grantedYes : false,
      deniedDate: appliedYes ? (!grantedYes ? deniedDate ? deniedDate.toISOString() : null : null) : null,
      fitmentStandard: !standardNo, // true = uppfyller standard
      feedback: standardNo ? feedback : "",
    };

    setAllAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = answer;
      return updated;
    });
  };

  /** När currentIndex ändras: ladda tillbaka ev. sparade svar, annars defaults */
  useEffect(() => {
    const a = allAnswers[currentIndex];
    if (!a) {
      loadDefaultsForQuestion();
      return;
    }

    // Återställ UI från sparat svar
    setNeedYes(a.need === true);
    setNeedNo(a.need === false);
    setFutureNeed(Boolean(a.futureNeed));
    setFutureNeedDate(a.futureNeedDate ?? (futureOptions[0] ?? null));
    setUrgency(typeof a.priority === "number" ? a.priority : 3);
    setAppliedYes(Boolean(a.applied));
    setAppliedDate(a.appliedDate ? new Date(a.appliedDate) : new Date());
    setGrantedYes(Boolean(a.granted));
    setGrantedDate(a.grantedDate ? new Date(a.grantedDate) : new Date());
    setDeniedYes(Boolean(a.denied));
    setDeniedDate(a.deniedDate ? new Date(a.deniedDate) : new Date());
    setStandardNo(!a.fitmentStandard);
    setFeedback(a.feedback || "");
  }, [currentIndex]);

  /** Initiera vid mount */
  useEffect(() => {
    // Starta med tomma svar och nollställt UI
    setAllAnswers([]);
    loadDefaultsForQuestion();
  }, []);

  /** Submit hela formuläret */
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

      // Spara säkert även sista stegets svar
      saveCurrentAnswer();

      const formId = `form_${Date.now()}`;

      const payload = {
        formId,
        type: "habilitering",
        individualId,
        // deep copy för att undvika referensstrul
        answers: JSON.parse(JSON.stringify(allAnswers)),
      };

      console.log(payload)

      // Inkludera även det absolut senaste svaret om setState ännu inte hunnit flushas
      if (!payload.answers[currentIndex]) {
        const last: FormAnswer = {
          id: currentIndex,
          need: needYes ? true : needNo ? false : false,
          futureNeed,
          futureNeedDate: futureNeed ? futureNeedDate : null,
          priority: urgency,
          applied: appliedYes,
          appliedDate: appliedYes ? appliedDate.toISOString() : null,
          granted: grantedYes,
          grantedDate: grantedYes ? grantedDate.toISOString() : null,
          denied: appliedYes ? !grantedYes : false,
          deniedDate: appliedYes ? (!grantedYes ? deniedDate ? deniedDate.toISOString() : null : null) : null,
          fitmentStandard: !standardNo,
          feedback: standardNo ? feedback : "",
        };
        payload.answers[currentIndex] = last;
      }
      const result = await submitFormToBackend(payload);

      if (!result) {
        setErrorMessage("Inget svar från servern.");
        return;
      }

    setSuccessMessage("Formulär sparat!");
    setTimeout(() => navigate("/result"), 1000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Fel vid formulärinlämning: " + error.message);
    }
  };

  /** Steg framåt/bakåt */
  const next = () => {
    saveCurrentAnswer();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      console.log("SAVED FORM")
      console.log(allAnswers)
      submitForm();
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      saveCurrentAnswer();
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div>
      <ButtonComp
              key={"back"}
              text="Tillbaka"
              onClick={() => navigate("/formList")}
              className="back-button"
            />
    <section className="form-section">
      <div className="form-container">
        {errorMessage && <p className="form-error-message">{errorMessage}</p>}
        {successMessage && <p className="form-success-message">{successMessage}</p>}
        <div className="form-form">
          <h1 className="form-h1">Fråga {currentIndex + 1} av {questions.length}</h1>
          <div className="form-question-header">
            <h2 className="form-h2">{questions[currentIndex]}</h2>
            <InfoTooltip text={explanations[currentIndex]} position="bottom" />
          </div>

          {/* INGET BEHOV */}
          <div className="form-checkbox-container">
            <CheckBox
              label={answers[0]}
              checked={needNo}
              onChange={() => {
                const next = !needNo;
                setNeedNo(next);
                if (next) setNeedYes(false); // ömsesidigt
              }}
            />
          </div>

          {/* Framtida behov only if "inget behov" */}
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
                  value={futureNeedDate ?? undefined}
                  onChange={setFutureNeedDate}
                />
              )}
            </div>
          )}

          {/* BEHOV (ja) */}
          <CheckBox
            label={answers[3]}
            checked={needYes}
            onChange={() => {
              const next = !needYes;
              setNeedYes(next);
              if (next) setNeedNo(false); 
            }}
          />

          {needYes && (
            <>
              <h3 className="form-subtitle">Hur akut är behovet?</h3>
              <Slider
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
              />

              {/* Ansökt? två vägar (ömsesidigt via explicit true/false) */}
              <CheckBox
                label={answers[4]}
                checked={!appliedYes}
                onChange={() => {
                  setAppliedYes(false)

                  // 🔥 Reset dependent state
                  setGrantedYes(false);
                  setDeniedYes(false);
                  setStandardNo(false)
                  setFeedback("");
                  setDeniedDate(null);   // or null
                }}
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
                onChange={() => {
                  setGrantedYes(false)
                  setDeniedYes(true)
                }
                }
              />
              <CheckBox
                label={answers[7]}
                checked={grantedYes}
                onChange={() => {
                  setGrantedYes(true)
                  setDeniedYes(false)
                }}
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

          {!grantedYes && needYes && appliedYes && (
            <DateInput
              text={answers[2]}
              value={deniedDate ?? new Date()} // Provide a default Date if deniedDate is null
              onChange={setDeniedDate}
            />
          )}

          {grantedYes && grantedDate && (
            <>
              {/* Uppfyller standard? */}
              <CheckBox
                label={answers[8]} // "Uppfyller inte standard"
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
                label={answers[10]} // "Uppfyller standard"
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
              //onClick={currentIndex === questions.length - 1 ? () => navigate("/result") : next}
            />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
