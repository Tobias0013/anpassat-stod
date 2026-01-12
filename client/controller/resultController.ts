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
  denied: boolean;
  deniedDate: string | null;
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
 * Fetch all forms for an individual.
 * @param individualId Individual ID
 * @returns List of forms
 * @throws Error if request fails
 */
export async function fetchFormsForIndividual(individualId: string): Promise<FormDto[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${API_BASE_URL}/individuals/${individualId}/forms`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to fetch forms");
  }

  return (await res.json()) as FormDto[];
}

/**
 * Fetch a form by its ID.
 * @param formId Form ID
 * @returns Form object
 * @throws Error if request fails
 */
export async function fetchFormById(formId: string): Promise<FormDto> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${API_BASE_URL}/forms/${encodeURIComponent(formId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to fetch form");
  }

  return (await res.json()) as FormDto;
}
