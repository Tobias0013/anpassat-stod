import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonComp from "../../component/buttonComp/buttonComp";
import { fetchFormsForIndividual, FormDto, FormAnswer } from "../../controller/resultController";

// ⚠️ Justera import-sökvägen så den pekar på din fil
// I din form-sida importerar du from "./habiliteringsQuestions"
// Från den här platsen kan det bli t.ex.:
import { questions } from "../formPage/habiliteringsQuestions"; // <-- ändra vid behov

function fmtDate(d?: string | null) {
  if (!d) return "—";
  const t = Date.parse(d);
  return isNaN(t) ? "—" : new Date(t).toLocaleDateString("sv-SE");
}
function yesNo(v?: boolean) {
  return v ? "Ja" : "Nej";
}

export default function Result() {
  const navigate = useNavigate();
  const [individualId] = useState<string | null>(() => localStorage.getItem("individualId"));

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

        // Senast uppdaterad överst
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

  const total = forms.length;

  const content = useMemo(() => {
    if (!individualId) {
      return (
        <div>
          <p style={{ color: "red" }}>Saknar individ. Välj en individ från översikten.</p>
          <ButtonComp text="Till dashboard" onClick={() => navigate("/dashboard")} />
        </div>
      );
    }
    if (loading) return <p>Laddar formulär...</p>;
    if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
    if (total === 0) return <p>Inga formulär hittades för denna individ.</p>;

    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {forms.map((f) => {
          const updated = f.lastUpdatedDate || f.updatedAt || f.createdAt || null;
          const answers = Array.isArray(f.answers) ? f.answers : [];

          return (
            <li
              key={f._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <header style={{ marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>{f.type || "Formulär"}</h2>
                <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
                  <span>Form ID: <code>{f.formId}</code></span>
                  <span> &nbsp;•&nbsp; Status: <strong>{f.complete ? "Färdig" : "Pågående"}</strong></span>
                  <span> &nbsp;•&nbsp; Uppdaterad: {updated ? new Date(updated).toLocaleString("sv-SE") : "—"}</span>
                </div>
              </header>

              {/* Lista varje fråga + svar */}
              {answers.length === 0 ? (
                <p style={{ marginTop: 8 }}>Inga svar inskickade.</p>
              ) : (
                <ol style={{ paddingLeft: 18, margin: 0 }}>
                  {answers.map((a: FormAnswer, idx: number) => {
                    const qText =
                      Array.isArray(questions) && questions[idx]
                        ? questions[idx]
                        : `Fråga ${idx + 1}`;

                    return (
                      <li key={idx} style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {qText}
                        </div>

                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                          <div><strong>Behov:</strong> {yesNo(a.need)}</div>

                          <div><strong>Framtida behov:</strong> {yesNo(a.futureNeed)}</div>
                          {a.futureNeed && (
                            <div><strong>Framtida datum:</strong> {fmtDate(a.futureNeedDate)}</div>
                          )}

                          {a.need && (
                            <>
                              <div><strong>Prioritet:</strong> {a.priority ?? "—"}</div>

                              <div><strong>Ansökt:</strong> {yesNo(a.applied)}</div>
                              {a.applied && (
                                <div><strong>Ansökt datum:</strong> {fmtDate(a.appliedDate)}</div>
                              )}

                              <div><strong>Beviljad:</strong> {yesNo(a.granted)}</div>
                              {a.granted && (
                                <div><strong>Beviljad datum:</strong> {fmtDate(a.grantedDate)}</div>
                              )}

                              <div><strong>Uppfyller standard:</strong> {yesNo(a.fitmentStandard)}</div>
                              {!a.fitmentStandard && (
                                <div><strong>Feedback:</strong> {a.feedback || "—"}</div>
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
    <main style={{ padding: 16 }}>
      <h1>Resultat</h1>
      {individualId && (
        <div style={{ marginBottom: 12, color: "#555" }}>
          Individ: <code>{individualId}</code>
          {total > 0 && <span> • {total} formulär</span>}
        </div>
      )}
      {content}
    </main>
  );
}
