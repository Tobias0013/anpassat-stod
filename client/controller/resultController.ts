export interface FormAnswer {
  id: number;
  need: boolean;
  futureNeed: boolean;
  futureNeedDate: string | null;
  priority: number;
  applied: boolean;
  appliedDate: string | null;
  granted: boolean;
  grantedDate: string | null;
  fitmentStandard: boolean;
  feedback: string;
}

export interface FormDto {
  _id: string;
  formId: string;
  type: string;
  individualId: string;
  answers: FormAnswer[];
  complete: boolean;
  lastUpdatedDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Base URL for API calls.
 *
 * Resolution order:
 * 1. Vite environment variable (VITE_API_URL)
 * 2. Create React App environment variable (REACT_APP_API_URL)
 * 3. Fallback to current host with port 3000 (for local development)
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) ||
  `${window.location.protocol}//${window.location.hostname}:3000`;

/**
 * Fetch all forms for a given individual.
 *
 * Backend route: GET /individuals/:id/forms
 *
 * @param {string} individualId - The ID of the individual.
 * @returns {Promise<FormDto[]>} A promise resolving to a list of forms.
 * @throws {Error} If the token is missing or the request fails.
 */
export async function fetchFormsForIndividual(individualId: string): Promise<FormDto[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${BASE_URL}/individuals/${individualId}/forms`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch forms");
  }

  return (await res.json()) as FormDto[];
}

/**
 * Fetch a single form by its formId.
 *
 * Backend route: GET /forms/:formId
 *
 * @param {string} formId - The ID of the form.
 * @returns {Promise<FormDto>} A promise resolving to the form object.
 * @throws {Error} If the token is missing or the request fails.
 */
export async function fetchFormById(formId: string): Promise<FormDto> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${BASE_URL}/forms/${encodeURIComponent(formId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch form");
  }

  return (await res.json()) as FormDto;
}
