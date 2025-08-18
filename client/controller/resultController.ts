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
 * Hämta alla formulär för en individ (individId från localStorage i vår setup).
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
