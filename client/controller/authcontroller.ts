import { encryptWithPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * Helper: read error response (JSON or text).
 */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 300);
  }
  return (await res.text().catch(() => "")).slice(0, 300);
}

/**
 * Registers a new user (fields encrypted client-side).
 */
export async function registerUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    mail: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };

  // Debug log request body (masked)
  // eslint-disable-next-line no-console
  console.log("[registerUser] URL:", `${AUTH_URL}/register`);
  // eslint-disable-next-line no-console
  console.log("[registerUser] Payload (encrypted):", body);

  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await readError(res);
    // eslint-disable-next-line no-console
    console.error("[registerUser] Backend error:", msg, "Status:", res.status);
    throw new Error(msg || `Registration failed (HTTP ${res.status})`);
  }

  const data = await res.json();
  // eslint-disable-next-line no-console
  console.log("[registerUser] Success:", data);
  return data;
}

/**
 * Authenticates a user and stores the JWT token.
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };

  // Debug log request body (masked)
  // eslint-disable-next-line no-console
  console.log("[loginUser] URL:", `${AUTH_URL}/login`);
  // eslint-disable-next-line no-console
  console.log("[loginUser] Payload (encrypted):", body);

  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await readError(res);
    // eslint-disable-next-line no-console
    console.error("[loginUser] Backend error:", msg, "Status:", res.status);
    throw new Error(msg || `Authentication failed (HTTP ${res.status})`);
  }

  const data = await res.json();
  // eslint-disable-next-line no-console
  console.log("[loginUser] Success:", data);

  localStorage.setItem("token", data.token);
  return data;
}
