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

const BASE_URL = "http://localhost:3000";

/**
 * Submits a completed form to the backend.
 */
export const submitFormToBackend = async (formPayload: SubmitFormPayload): Promise<any> => {
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
    const err = await res.json();
    throw new Error(err.message || "Failed to submit form");
  }

  return res.json();
};
