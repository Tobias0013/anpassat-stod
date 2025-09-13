export interface EventDto {
  _id: string;
  eventDate: string;
  category: "TRANSPORT" | "ÖVRIGT";
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

import { API_BASE_URL } from "../utils/config";
const BASE_URL = API_BASE_URL;
/**
 * Fetch events for an individual.
 *
 * Backend route: GET /events/events/:id (mounted under /events).
 *
 * @param {string} individualId - The ID of the individual.
 * @returns {Promise<EventDto[]>} A promise resolving to the individual's events.
 * @throws {Error} If no token exists or the request fails.
 */
export async function fetchEventsForIndividual(individualId: string): Promise<EventDto[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${BASE_URL}/events/events/${encodeURIComponent(individualId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let msg = `Failed to fetch events (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(msg);
  }

  const body = await res.json();
  return (body?.individualEvents ?? []) as EventDto[];
}

/**
 * Create a new event for an individual.
 *
 * Backend route: POST /events/register (mounted under /events).
 * `category` must match backend enum exactly ("TRANSPORT" | "ÖVRIGT").
 *
 * @param {Object} params - Event creation parameters.
 * @param {string} params.message - The event message.
 * @param {"TRANSPORT" | "ÖVRIGT"} params.category - The category of the event.
 * @param {string} [params.individualId] - The individual ID (defaults to localStorage).
 * @param {string} [params.eventDate] - The event date (defaults to now).
 * @returns {Promise<EventDto>} A promise resolving to the created event.
 * @throws {Error} If no token or individualId is found, or if the request fails.
 */
export async function createEventForIndividual(params: {
  message: string;
  category: "TRANSPORT" | "ÖVRIGT";
  individualId?: string;
  eventDate?: string;
}): Promise<EventDto> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const individualId = params.individualId ?? localStorage.getItem("individualId");
  if (!individualId) throw new Error("Missing individualId");

  const payload = {
    individualId: String(individualId).trim(),
    eventDate: params.eventDate ?? new Date().toISOString(),
    category: params.category,
    message: params.message,
  };

  console.log("Sending payload to backend:", payload);

  const res = await fetch(`${BASE_URL}/events/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Failed to create event (HTTP ${res.status})`;
    try {
      const body = await res.json();
      console.error("Backend error:", body);
      if (body?.message) msg = body.message;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(msg);
  }

  return (await res.json()) as EventDto;
}
