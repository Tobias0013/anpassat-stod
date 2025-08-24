// src/pages/eventOfTheDay/eventOfTheDay.tsx
import React, { useCallback, useEffect, useState } from "react";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";
import {
  createEventForIndividual,
  fetchEventsForIndividual,
  EventDto,
} from "../../controller/eventController";
import "./eventOfTheDay.css";

/**
 * EventOfTheDay renders a note field for “Dagens händelse” and a scrollable
 * history list (newest first) for the currently selected individual.
 *
 * Layout details:
 * - Uses a wrapper .event-inner so the footer/history area can flex and scroll.
 * - The “Spara” button keeps its position; history scrolls inside the box.
 *
 * Category:
 * - UI label “Färdtjänst” maps to backend enum "TRANSPORT".
 */
const EventOfTheDay: React.FC = () => {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventDto[]>([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const CATEGORY_LABEL = "Färdtjänst";
  const CATEGORY_ENUM: "TRANSPORT" = "TRANSPORT";
  const [sendCategory, setSendCategory] = useState<boolean>(false);

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
        category: CATEGORY_ENUM,
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
    if (cat === "ÖVRIGT") return "Övrigt";
    return cat ?? "—";
  };

  return (
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
            <label className="event-category-checkbox">
              <input
                type="checkbox"
                checked={sendCategory}
                onChange={() => setSendCategory((v) => !v)}
              />
              <span>{CATEGORY_LABEL}</span>
            </label>
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
              <div className="event-history-actions">
                <ButtonComp
                  text={fetching ? "Uppdaterar..." : "Uppdatera"}
                  onClick={loadHistory}
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
  );
};

export default EventOfTheDay;
