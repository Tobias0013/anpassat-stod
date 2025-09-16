import { API_BASE_URL } from "../utils/config";

const ACCOUNTS_URL = `${API_BASE_URL}/accounts`;

/** Read a short error message from a Response (JSON or text). */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return (j as any)?.message || JSON.stringify(j).slice(0, 800);
  }
  return (await res.text().catch(() => "")).slice(0, 800);
}

/**
 * GET helper with Bearer auth that throws with a concise server message.
 */
async function getWithAuth(url: string, token: string): Promise<any> {
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await readError(res);
    // eslint-disable-next-line no-console
    console.error(`[accounts] ${url} error:`, msg, "Status:", res.status);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch individuals for the currently logged-in account.
 * - Reads JWT from localStorage
 * - Decodes account id from payload
 * - Calls GET /accounts/:id/individuals
 */
export async function fetchAccountIndividuals(): Promise<any[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. User not authenticated.");

  // Decode JWT payload safely
  let accountId: string | undefined;
  try {
    const payloadStr = atob(token.split(".")[1] || "");
    const payload = JSON.parse(payloadStr);
    accountId = payload.id || payload.accountId || payload.sub; // fallback options
  } catch {
    throw new Error("Invalid token. Please log in again.");
  }

  if (!accountId) throw new Error("Account ID missing in token.");

  const url = `${ACCOUNTS_URL}/${accountId}/individuals`;
  // eslint-disable-next-line no-console
  console.log("Calling URL:", url);

  const data = await getWithAuth(url, token);
  return data.individuals ?? [];
}
