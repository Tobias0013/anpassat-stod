// client/pages/Result.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ButtonComp from "../../component/buttonComp/buttonComp";
import { fetchFormsForIndividual, FormDto } from "../../controller/resultController";

export default function Result() {
  const navigate = useNavigate();

  // Läs individen ENBART från localStorage (ingen URL-param i denna setup)
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

        // sortera: senast uppdaterad överst
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
          const updatedFmt = updated ? new Date(updated).toLocaleString("sv-SE") : "—";
          const answersCount = f.answers?.length || 0;

          return (
            <li
              key={f._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <h2 style={{ marginBottom: 8 }}>{f.type || "Formulär"}</h2>
              <p>Form ID: <code>{f.formId}</code></p>
              <p>Status: {f.complete ? "Färdig" : "Pågående"}</p>
              <p>Svar: {answersCount}</p>
              <p>Uppdaterad: {updatedFmt}</p>

              <div style={{ marginTop: 8 }}>
                <Link to={`/forms/${encodeURIComponent(f.formId)}`}>
                  <ButtonComp text="Visa formulär" onClick={() => navigate(`/forms/${encodeURIComponent(f.formId)}`)} />
                </Link>
              </div>
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
