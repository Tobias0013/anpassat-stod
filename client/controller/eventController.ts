import { API_BASE_URL } from "../utils/config";

export interface EventDto {
  _id: string;
  eventDate: string;
  category: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch all events for a specific individual.
 * @param individualId Individual ID
 * @returns List of events
 * @throws Error if request fails
 */
export async function fetchEventsForIndividual(individualId: string): Promise<EventDto[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${API_BASE_URL}/events/events/${encodeURIComponent(individualId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `Failed to fetch events (HTTP ${res.status})`);
  }

  const body = await res.json();
  return (body?.individualEvents ?? []) as EventDto[];
}

/**
 * Create a new event for an individual.
 * @param params Event details
 * @returns Created event
 * @throws Error if request fails
 */
export async function createEventForIndividual(params: {
  message: string;
  category: string;
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

  const res = await fetch(`${API_BASE_URL}/events/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `Failed to create event (HTTP ${res.status})`);
  }

  return (await res.json()) as EventDto;
}
