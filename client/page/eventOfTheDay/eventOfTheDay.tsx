import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";
import DateInput from "../../component/dateInput/dateInput";
import {
  createEventForIndividual,
  fetchEventsForIndividual,
  EventDto,
} from "../../controller/eventController";
import "./eventOfTheDay.css";
import jsPDF from "jspdf";

const EventOfTheDay: React.FC = () => {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventDto[]>([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const [pdfStartDate, setPdfStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [pdfEndDate, setPdfEndDate] = useState<Date>(new Date());

  const CATEGORY_LABEL = "Färdtjänst";
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

  // --- Simple: download ALL events into ONE PDF (no autotable) ---
  const downloadAllEventsPDF = () => {
    if (!events.length) {
      setErrMsg("Det finns inga händelser att spara.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const maxWidth = pageW - margin * 2;
    const lineH = 14;
    let y = margin;

    const individStr = individualName || individualId || "—";

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Händelser", margin, y);
    y += 24;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Individ: ${individStr}`, margin, y);
    y += 18;
    doc.text(`Genererad: ${new Date().toLocaleString("sv-SE")}`, margin, y);
    y += 20;

    // Helper for page break
    const ensureSpace = (needed: number) => {
      if (y + needed > pageH - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // One block per event
    const startDate = pdfStartDate; // Replace with your desired start date
    const endDate = pdfEndDate; // Replace with your desired end date

    const filteredEvents = events.filter((ev) => {
      const eventDate = new Date(ev.updatedAt || ev.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });

    filteredEvents.forEach((ev, idx) => {
      const dateStr = fmtDateTime(ev.updatedAt || ev.eventDate);
      const catStr = renderCategoryLabel(ev.category);
      const msgLines = doc.splitTextToSize(ev.message || "", maxWidth);

      const blockHeight =
        16 + // title
        lineH + // meta (kategori)
        10 + // gap before label
        lineH + // "Meddelande:"
        msgLines.length * 12 + // message lines
        16; // bottom gap

      ensureSpace(blockHeight);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`${idx + 1}. ${dateStr}`, margin, y);
      y += 16;

      // Meta
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Kategori: ${catStr}`, margin, y);
      y += lineH;

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Meddelande:", margin, y);
      y += lineH - 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(msgLines, margin, y);
      y += msgLines.length * 12 + 16;
    });

    const safeName = (individStr || "individ").toString().replace(/[^\w\-]+/g, "_");
    const today = new Date().toISOString().slice(0, 10);
    doc.save(`handelser_${safeName}_${today}.pdf`);
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
              <div
                className="event-history-header"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <h2 style={{ margin: 0 }}>Historik</h2>
                <span className="event-history-count">({events.length})</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
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
                    text="Spara händelser som PDF"
                    onClick={downloadAllEventsPDF}
                  />
                </div>
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
                        {/* Per-event PDF button removed */}
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
