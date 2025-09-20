import { API_BASE_URL } from "../utils/config";

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
 * Submit a completed form.
 * @param formPayload Form data
 * @returns Backend response
 * @throws Error if request fails
 */
export async function submitFormToBackend(formPayload: SubmitFormPayload): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");
  if (!formPayload.individualId) throw new Error("Missing individual ID");

  const res = await fetch(`${API_BASE_URL}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to submit form");
  }

  return res.json();
}
