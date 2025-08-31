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

export interface SubmitFormPayload {
  type: string;
  formId: string;
  individualId: string;
  answers: FormAnswer[];
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
 * Submits a completed form to the backend.
 *
 * @param {SubmitFormPayload} formPayload - The form data to submit.
 * @returns {Promise<any>} The backend response data.
 * @throws {Error} If the token is missing, the individual ID is missing, or the request fails.
 */
export const submitFormToBackend = async (
  formPayload: SubmitFormPayload
): Promise<any> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Missing token. Please log in again.");
  }

  if (!formPayload.individualId) {
    throw new Error("Missing individual ID. Cannot submit form.");
  }

  const res = await fetch(`${BASE_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formPayload),
  });

  if (!res.ok) {
    let message = "Failed to submit form";
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json();
};
