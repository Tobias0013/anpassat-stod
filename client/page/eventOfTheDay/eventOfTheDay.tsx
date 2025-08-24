import React, { useEffect, useState } from "react";
import TextArea from "../../component/textArea/textArea";
import ButtonComp from "../../component/buttonComp/buttonComp";
import {
  createEventForIndividual,
  fetchEventsForIndividual,
  EventDto,
} from "../../controller/eventController";
import "./eventOfTheDay.css";

/**
 * EventOfTheDay component lets the user enter and review daily notes ("dagens händelse")
 * for the currently selected individual.
 *
 * Category handling:
 * - UI label "Färdtjänst" maps to backend enum "TRANSPORT".
 * - You can add more categories later by extending LABEL→ENUM mappings.
 *
 * @example
 * return <EventOfTheDay />
 *
 * @returns {JSX.Element} Rendered "Event of the Day" page.
 *
 * @throws {Error} Displays error messages when backend requests fail.
 */
const EventOfTheDay: React.FC = () => {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // UI label ↔ backend enum mapping
  const CATEGORY_LABEL = "Färdtjänst";
  const CATEGORY_ENUM: "TRANSPORT" = "TRANSPORT"; // what we send to backend

  const [sendCategory, setSendCategory] = useState<boolean>(false);

  const individualId = localStorage.getItem("individualId");
  const individualName = localStorage.getItem("individualName");

  // Load previous events on mount
  useEffect(() => {
    const load = async () => {
      if (!individualId) {
        setErrMsg("Saknar individ. Välj en individ från översikten.");
        return;
      }
      setErrMsg("");
      setLoading(true);
      try {
        const data = await fetchEventsForIndividual(individualId);
        data.sort((a, b) => {
          const da = Date.parse(a.updatedAt || a.eventDate || "") || 0;
          const db = Date.parse(b.updatedAt || b.eventDate || "") || 0;
          return db - da;
        });
        setEvents(data);
      } catch (e: any) {
        setErrMsg(e?.message || "Fel vid hämtning av händelser.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [individualId]);

  /** Save a new event (requires the checkbox to be checked) */
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
    setLoading(true);
    try {
      const created = await createEventForIndividual({
        message: text.trim(),
        individualId,
        category: CATEGORY_ENUM, // send enum value
      });
      setEvents((prev) => [created, ...prev]);
      setText("");
    } catch (e: any) {
      setErrMsg(e?.message || "Kunde inte spara händelsen.");
    } finally {
      setLoading(false);
    }
  };

  const fmtDateTime = (iso?: string) => {
    if (!iso) return "—";
    const t = Date.parse(iso);
    return isNaN(t) ? "—" : new Date(iso).toLocaleString("sv-SE");
  };

  // Render category value from enum back to friendly label for history list
  const renderCategoryLabel = (cat?: EventDto["category"]) => {
    if (cat === "TRANSPORT") return CATEGORY_LABEL;
    if (cat === "ÖVRIGT") return "Övrigt";
    return cat ?? "—";
  };

  return (
    <div className="event-section">
      <div className="event-container">
        <h1 className="event-heading">Dagens händelse</h1>

        {individualName || individualId ? (
          <p className="event-meta">
            Individ: <strong>{individualName || individualId}</strong>
          </p>
        ) : null}

        {errMsg && <p className="event-error">{errMsg}</p>}

        {/* Single required category */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Kategori (krävs)</div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={sendCategory}
              onChange={() => setSendCategory((v) => !v)}
            />
            <span>{CATEGORY_LABEL}</span>
          </label>
        </div>

        {/* Message + Save */}
        <div className="event-form">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Vad hände idag?"
            className="event-textarea"
          />
          <ButtonComp text={loading ? "Sparar..." : "Spara"} onClick={handleSave} />
        </div>

        {/* History */}
        <div className="event-history">
          <h2>Tidigare händelser</h2>
          {loading && <p>Laddar...</p>}
          {!loading && events.length === 0 && <p>Inga händelser sparade ännu.</p>}
          {!loading && events.length > 0 && (
            <ul className="event-list">
              {events.map((ev) => (
                <li key={ev._id} className="event-item">
                  <div className="event-item-header">
                    <span className="event-item-date">
                      {fmtDateTime(ev.updatedAt || ev.eventDate)}
                    </span>
                    {ev.category && (
                      <span className="event-item-cat">{renderCategoryLabel(ev.category)}</span>
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
  );
};

export default EventOfTheDay;
