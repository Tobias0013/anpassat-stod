// client/controller/resultController.ts

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

const BASE_URL = "http://localhost:3000";

/**
 * Hämta alla formulär för en individ.
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
 * VALFRITT: hämta ett specifikt formulär via formId (använder din getFormById).
 * Endast om du vill säkerställa senaste versionen per form.
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
