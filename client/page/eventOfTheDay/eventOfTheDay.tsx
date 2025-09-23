import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";
import {
  createEventForIndividual,
  fetchEventsForIndividual,
  EventDto,
} from "../../controller/eventController";
import "./eventOfTheDay.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EventOfTheDay: React.FC = () => {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventDto[]>([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const CATEGORY_LABEL = "Färdtjänst";
  const CATEGORY_ENUM: "TRANSPORT" = "TRANSPORT";
  const [sendCategory, setSendCategory] = useState<string>("");

  const individualId = localStorage.getItem("individualId");
  const individualName = localStorage.getItem("individualName");

  const sortNewest = (list: EventDto[]) =>
    [...list].sort((a, b) => {
      const da = Date.parse(a.updatedAt || a.eventDate || "") || 0;
      const db = Date.parse(b.updatedAt || b.eventDate || "") || 0;
      return db - da;
    });

  const loadHistory = useCallback(async () => {
    if (!individualId) {
      setErrMsg("Saknar individ. Välj en individ från översikten.");
      setEvents([]);
      return;
    }
    setErrMsg("");
    setFetching(true);
    try {
      const data = await fetchEventsForIndividual(individualId);
      setEvents(sortNewest(data));
    } catch (e: any) {
      setErrMsg(e?.message || "Fel vid hämtning av händelser.");
      setEvents([]);
    } finally {
      setFetching(false);
    }
  }, [individualId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSave = async () => {
    if (!text.trim()) {
      setErrMsg("Skriv något innan du sparar.");
      return;
    }
    if (!individualId) {
      setErrMsg("Saknar individ. Välj en individ från översikten.");
      return;
    }
    if (!sendCategory) {
      setErrMsg(`Bocka i '${CATEGORY_LABEL}' innan du sparar.`);
      return;
    }

    setErrMsg("");
    setSaving(true);
    try {
      const created = await createEventForIndividual({
        message: text.trim(),
        individualId,
        category: sendCategory,
      });
      setEvents((prev) => sortNewest([created, ...prev]));
      setText("");

      try {
        await loadHistory();
      } catch {}
    } catch (e: any) {
      setErrMsg(e?.message || "Kunde inte spara händelsen.");
    } finally {
      setSaving(false);
    }
  };

  const fmtDateTime = (iso?: string) =>
    !iso ? "—" : new Date(iso).toLocaleString("sv-SE");

  const renderCategoryLabel = (cat?: EventDto["category"]) => {
    if (cat === "TRANSPORT") return "Färdtjänst";
    if (cat === "SKOLSKJUTS") return "Skolskjuts";
    if (cat === "HEMMA") return "Hemma";
    if (cat === "FÖRSKOLA") return "Förskola";
    if (cat === "SKOLA") return "Skola";
    if (cat === "FRITID") return "Fritid";
    if (cat === "ÖVRIGT") return "Övrigt";
    return cat ?? "—";
  };

  // --- PDF helper: download a single event as PDF ---
  const downloadEventPDF = (ev: EventDto) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const title = "Dagens händelse";
    const dateStr = fmtDateTime(ev.updatedAt || ev.eventDate);
    const categoryStr = renderCategoryLabel(ev.category);
    const individStr = individualName || individualId || "—";
    const left = 48;
    let y = 64;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, left, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Individ: ${individStr}`, left, y);
    y += 18;
    doc.text(`Datum: ${dateStr}`, left, y);
    y += 18;
    doc.text(`Kategori: ${categoryStr}`, left, y);
    y += 28;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Meddelande", left, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const maxWidth = doc.internal.pageSize.getWidth() - left * 2;
    const lines = doc.splitTextToSize(ev.message || "", maxWidth);
    doc.text(lines, left, y);

    const safeName = (individStr || "individ").toString().replace(/[^\w\-]+/g, "_");
    const safeDate = (ev.updatedAt || ev.eventDate || "").toString().replace(/[: ]+/g, "_");
    doc.save(`händelse_${safeName}_${safeDate || "datum"}.pdf`);
  };

  const navigate = useNavigate();

  return (
    <div>
      <ButtonComp
              key={"back"}
              text="Tillbaka"
              onClick={() => navigate("/dashboard")}
              className="back-button"
            />
    <div className="event-section">
      <div className="event-container">
        <div className="event-inner">
          <h1 className="event-heading">Dagens händelse</h1>

          {(individualName || individualId) && (
            <p className="event-meta">
              Individ: <strong>{individualName || individualId}</strong>
            </p>
          )}

          {errMsg && <p className="event-error">{errMsg}</p>}

          <div className="event-category">
            <div className="event-category-title">Kategori (krävs)</div>
            {/* <label className="event-category-checkbox">
              <input
                type="checkbox"
                checked={sendCategory}
                onChange={() => setSendCategory((v) => !v)}
              />
              <span>{CATEGORY_LABEL}</span>
            </label> */}
              <select
                value={sendCategory}
                onChange={(e) => setSendCategory(e.target.value)}
              >
                <option value="" disabled>
                  Välj kategori
                </option>
                <option value="TRANSPORT">Färdtjänst</option>
                <option value="SKOLSKJUTS">Skolskjuts</option>
                <option value="HEMMA">Hemma</option>
                <option value="FÖRSKOLA">Förskola</option>
                <option value="SKOLA">Skola</option>
                <option value="FRITID">Fritid</option>
                <option value="ÖVRIGT">Övrigt</option>
              </select>
          </div>
          
          <div className="event-form">
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Vad hände idag?"
              className="event-textarea"
            />
            <ButtonComp
              className="auth-btn"
              text={saving ? "Sparar..." : "Spara"}
              onClick={handleSave}
            />
          </div>

          <div className="event-history">
            <div className="event-history-header">
              <h2>Historik</h2>
              <span className="event-history-count">({events.length})</span>
            </div>

            {fetching && <p className="event-history-loading">Laddar...</p>}
            {!fetching && events.length === 0 && (
              <p className="event-history-empty">Inga händelser sparade ännu.</p>
            )}

            {!fetching && events.length > 0 && (
              <ul className="event-list">
                {events.map((ev) => (
                  <li key={ev._id} className="event-item">
                    <div className="event-item-header">
                      <span className="event-item-date">
                        {fmtDateTime(ev.updatedAt || ev.eventDate)}
                      </span>
                      {ev.category && (
                        <span className="event-item-cat">
                          {renderCategoryLabel(ev.category)}
                        </span>
                      )}
                      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        <ButtonComp
                          className="pdf-btn"
                          text="Spara som PDF"
                          onClick={() => downloadEventPDF(ev)}
                        />
                      </div>
                    </div>
                    <div className="event-item-msg">{ev.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EventOfTheDay;

