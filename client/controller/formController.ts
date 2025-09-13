import { API_BASE_URL } from "../utils/config";
const BASE_URL = API_BASE_URL;

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
