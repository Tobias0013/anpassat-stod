import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonComp from "../../component/buttonComp/buttonComp";
import { fetchFormsForIndividual, FormDto, FormAnswer } from "../../controller/resultController";
import { questions } from "../formPage/habiliteringsQuestions";
import DateInput from "../../component/dateInput/dateInput";

import jsPDF from "jspdf";
import "./resultPage.css";

export default function Result() {
  const navigate = useNavigate();

  const [individualId] = useState<string | null>(() => localStorage.getItem("individualId"));
  const [individualName] = useState<string | null>(() => localStorage.getItem("individualName"));

  const [forms, setForms] = useState<FormDto[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [pdfStartDate, setPdfStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [pdfEndDate, setPdfEndDate] = useState<Date>(new Date());

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

  function fmtDateOrLabel(d?: string | null) {
    if (!d) return "—";
    const t = Date.parse(d);
    if (!isNaN(t)) return new Date(t).toLocaleDateString("sv-SE");
    return d;
  }

  function yesNo(v?: boolean) {
    return v ? "Ja" : "Nej";
  }

  // --------------------------------------------------------
  // ⭐ NEW: Generate a single PDF containing ALL forms
  // --------------------------------------------------------
  const downloadAllFormsPDF = () => {
    if (!forms.length) {
      alert("Det finns inga formulär att spara.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const maxWidth = pageW - margin * 2;
    let y = margin;

    const individStr = individualName || individualId || "—";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Formulärresultat", margin, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Individ: ${individStr}`, margin, y);
    y += 18;
    doc.text(`Genererad: ${new Date().toLocaleString("sv-SE")}`, margin, y);
    y += 26;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageH - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const startDate = pdfStartDate; // Replace with your desired start date
    const endDate = pdfEndDate; // Replace with your desired end date

    const filteredForms = forms.filter((f) => {
      const eventDate = new Date(f.lastUpdatedDate || f.updatedAt || f.createdAt || 0);
      return eventDate >= startDate && eventDate <= endDate;
    });

    filteredForms.forEach((f, formIndex) => {
      const updated = f.lastUpdatedDate || f.updatedAt || f.createdAt || null;
      const answers = Array.isArray(f.answers) ? f.answers : [];

      // Section header
      const formTitle = `${formIndex + 1}. ${f.type ? f.type.charAt(0).toUpperCase() + f.type.slice(1) : "Formulär"}`;
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(formTitle, margin, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Uppdaterad: ${updated ? new Date(updated).toLocaleString("sv-SE") : "—"}`, margin, y);
      y += 22;

      if (!answers.length) {
        ensureSpace(20);
        doc.text("Inga svar inskickade.", margin, y);
        y += 24;
        return;
      }

      answers.forEach((a: FormAnswer, idx: number) => {
        const qText =
          Array.isArray(questions) && questions[idx] ? questions[idx] : `Fråga ${idx + 1}`;

        const msgLines = doc.splitTextToSize(qText, maxWidth);

        ensureSpace(18 + msgLines.length * 12);
        doc.setFont("helvetica", "bold");
        doc.text(`${idx + 1}. ${msgLines}`, margin, y);
        y += msgLines.length * 12 + 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        const addLine = (label: string, value: string) => {
          const line = `${label}: ${value}`;
          const lh = 14;
          ensureSpace(lh);
          doc.text(line, margin + 14, y);
          y += lh;
        };

        addLine("Behov", yesNo(a.need));
        addLine("Framtida behov", yesNo(a.futureNeed));
        if (a.futureNeed) addLine("Framtida datum", fmtDateOrLabel(a.futureNeedDate));

        if (a.need) {
          addLine("Prioritet", a.priority?.toString() || "—");
          addLine("Ansökt", yesNo(a.applied));
          if (a.applied) addLine("Ansökt datum", fmtDate(a.appliedDate));

          addLine("Beviljad", yesNo(a.granted));
          if (a.granted) addLine("Beviljad datum", fmtDate(a.grantedDate));

          addLine("Uppfyller standard", yesNo(a.fitmentStandard));

          if (!a.fitmentStandard) {
            const feedbackLines = doc.splitTextToSize(a.feedback || "—", maxWidth - 20);
            ensureSpace(14 + feedbackLines.length * 12);
            doc.text("Feedback:", margin + 14, y);
            y += 14;
            doc.text(feedbackLines, margin + 28, y);
            y += feedbackLines.length * 12;
          }
        }

        y += 12;
      });

      y += 20;
    });

    const safeName = (individStr || "individ").toString().replace(/[^\w\-]+/g, "_");
    const today = new Date().toISOString().slice(0, 10);
    doc.save(`formular_${safeName}_${today}.pdf`);
  };

  // --------------------------------------------------------

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
                    <span>Uppdaterad: {updated ? new Date(updated).toLocaleString("sv-SE") : "—"}</span>
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
                              <div><span className="answer-label">Avslagen:</span> {yesNo(!a.granted)}</div>
                              {!a.granted && (
                                <div><span className="answer-label">Avslagen datum:</span> {fmtDate(a.deniedDate)}</div>
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
    <div>
      <ButtonComp
        key={"back"}
        text="Tillbaka"
        onClick={() => navigate("/dashboard")}
        className="back-button"
      />

      <section className="form-section">
        <div className="form-container">
          <div className="form-form">
            <h1 className="form-h1">Resultat</h1>

            <div className="result-header" >
              <span className="result-header-name">
                Individ: <strong>{individualName || individualId}</strong>
              </span>

              {total > 0 && (
                <>
                  <span className="result-header-count">{total} formulär</span>

                  {}

                  <DateInput
                    className="pdf-date"
                    text={"Från"}
                    value={pdfStartDate}
                    onChange={setPdfStartDate}
                  />
                  <DateInput
                    className="pdf-date"
                    text={"Till"}
                    value={pdfEndDate}
                    onChange={setPdfEndDate}
                  />
                  <ButtonComp
                    className="pdf-btn"
                    text="Spara formulär som PDF"
                    onClick={downloadAllFormsPDF}
                  />
                </>
              )}
            </div>

            {content}
          </div>
        </div>
      </section>
    </div>
  );
}
