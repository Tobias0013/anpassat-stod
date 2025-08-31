import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonComp from "../../component/buttonComp/buttonComp";
import { fetchFormsForIndividual, FormDto, FormAnswer } from "../../controller/resultController";
import { questions } from "../formPage/habiliteringsQuestions";

import "./resultPage.css";

/**
 * Result component displays all forms for the currently selected individual.
 * It retrieves the individual ID and name from localStorage and fetches
 * associated forms from the backend. Each form is rendered inline with
 * its answers mapped to the corresponding questions.
 *
 * The page includes loading, error, and empty states for a smooth user experience.
 * Form metadata such as last updated date is displayed, while form IDs are hidden
 * for now (commented out for future use).
 *
 * @example
 * return (
 *   <Result />
 * )
 *
 * @returns {JSX.Element} The rendered result page component.
 *
 * @throws {Error} Displays an error message if fetching forms fails.
 */
export default function Result() {
  const navigate = useNavigate();

  const [individualId] = useState<string | null>(() => localStorage.getItem("individualId"));
  const [individualName] = useState<string | null>(() => localStorage.getItem("individualName"));

  const [forms, setForms] = useState<FormDto[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!individualId) {
        setErrorMessage("Saknar individ. Välj en individ från översikten.");
        return;
      }
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchFormsForIndividual(individualId);

        data.sort((a, b) => {
          const aDate = Date.parse(a.lastUpdatedDate || a.updatedAt || a.createdAt || "") || 0;
          const bDate = Date.parse(b.lastUpdatedDate || b.updatedAt || b.createdAt || "") || 0;
          if (bDate !== aDate) return bDate - aDate;
          return (b.formId || "").localeCompare(a.formId || "");
        });

        setForms(data);
      } catch (e: any) {
        setErrorMessage(e?.message || "Fel vid hämtning av formulär.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [individualId]);

  function fmtDate(d?: string | null) {
    if (!d) return "—";
    const t = Date.parse(d);
    return isNaN(t) ? "—" : new Date(t).toLocaleDateString("sv-SE");
  }

  // NEW: shows label if not a parseable date (e.g. "1 månad")
  function fmtDateOrLabel(d?: string | null) {
    if (!d) return "—";
    const t = Date.parse(d);
    if (!isNaN(t)) return new Date(t).toLocaleDateString("sv-SE");
    return d; // fallback to the stored label
  }

  function yesNo(v?: boolean) {
    return v ? "Ja" : "Nej";
  }

  const total = forms.length;

  const content = useMemo(() => {
    if (!individualId) {
      return (
        <div>
          <p className="form-error-message">Saknar individ. Välj en individ från översikten.</p>
          <div className="form-btn-container">
            <ButtonComp className="form-btn" text="Till dashboard" onClick={() => navigate("/dashboard")} />
          </div>
        </div>
      );
    }
    if (loading) return <p>Laddar formulär...</p>;
    if (errorMessage) return <p className="form-error-message">{errorMessage}</p>;
    if (total === 0) return <p className="form-h2">Inga formulär hittades för denna individ.</p>;

    return (
      <ul className="result-list">
        {forms.map((f) => {
          const updated = f.lastUpdatedDate || f.updatedAt || f.createdAt || null;
          const answers = Array.isArray(f.answers) ? f.answers : [];

          return (
            <li key={f._id} className="result-card">
              <header className="result-card-header">
                <div className="result-title-row">
                  <h3 className="result-form-type">
                    {f.type ? f.type.charAt(0).toUpperCase() + f.type.slice(1) : "Formulär"}
                  </h3>
                  <div className="result-meta">
                    {/* <span>Form ID: <code>{f.formId}</code></span> */}
                    <span>Uppdaterad: {updated ? new Date(updated).toLocaleString("sv-SE") : "—"}</span>
                    {/* Status används inte just nu, implementera i framtid?
                    <span>Status: <strong>{f.complete ? "Färdig" : "Pågående"}</strong></span>
                    */}
                  </div>
                </div>
              </header>

              {answers.length === 0 ? (
                <p className="result-empty">Inga svar inskickade.</p>
              ) : (
                <ol className="answer-list">
                  {answers.map((a: FormAnswer, idx: number) => {
                    const qText =
                      Array.isArray(questions) && questions[idx]
                        ? questions[idx]
                        : `Fråga ${idx + 1}`;

                    return (
                      <li key={idx} className="answer-item">
                        <div className="answer-question">{qText}</div>

                        <div className="answer-grid">
                          <div><span className="answer-label">Behov:</span> {yesNo(a.need)}</div>
                          <div><span className="answer-label">Framtida behov:</span> {yesNo(a.futureNeed)}</div>
                          {a.futureNeed && (
                            <div><span className="answer-label">Framtida datum:</span> {fmtDateOrLabel(a.futureNeedDate)}</div>
                          )}

                          {a.need && (
                            <>
                              <div><span className="answer-label">Prioritet:</span> {a.priority ?? "—"}</div>
                              <div><span className="answer-label">Ansökt:</span> {yesNo(a.applied)}</div>
                              {a.applied && (
                                <div><span className="answer-label">Ansökt datum:</span> {fmtDate(a.appliedDate)}</div>
                              )}
                              <div><span className="answer-label">Beviljad:</span> {yesNo(a.granted)}</div>
                              {a.granted && (
                                <div><span className="answer-label">Beviljad datum:</span> {fmtDate(a.grantedDate)}</div>
                              )}
                              <div><span className="answer-label">Uppfyller standard:</span> {yesNo(a.fitmentStandard)}</div>
                              {!a.fitmentStandard && (
                                <div className="answer-feedback">
                                  <span className="answer-label">Feedback:</span> {a.feedback || "—"}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    );
  }, [individualId, loading, errorMessage, total, forms, navigate]);

  return (
    <section className="form-section">
      <div className="form-container">
        <div className="form-form">
          <h1 className="form-h1">Resultat</h1>

          <div className="result-header">
            <span className="result-header-name">
              Individ: <strong>{individualName || individualId}</strong>
            </span>
            {total > 0 && <span className="result-header-count">{total} formulär</span>}
          </div>

          {content}
        </div>
      </div>
    </section>
  );
}
