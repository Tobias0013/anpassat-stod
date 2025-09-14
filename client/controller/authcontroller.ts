/**
 * Auth controller: register & login with encrypted fields.
 * - Sends email+username+mail to be compatible with older/newer backends.
 * - Retries once on HTTP 500 by refreshing the public key (handles key rotation).
 * - Logs backend error text to console for debugging; shows friendly UI error.
 */
import { encryptWithPublicKey, refreshPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/** Read error payload from Response (JSON or text). */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 800);
  }
  return (await res.text().catch(() => "")).slice(0, 800);
}

/** POST helper that retries once after refreshing the public key if we see HTTP 500. */
async function postWithKeyRetry(url: string, body: any): Promise<any> {
  const attempt = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  let res = await attempt();

  if (res.status === 500) {
    // eslint-disable-next-line no-console
    console.warn("[auth] 500 received — refreshing public key and retrying once");
    await refreshPublicKey();
    res = await attempt();
  }

  if (!res.ok) {
    const msg = await readError(res);
    // eslint-disable-next-line no-console
    console.error(`[auth] ${url} error:`, msg, "Status:", res.status);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Registers a new user (fields encrypted client-side). */
export async function registerUser(email: string, password: string): Promise<any> {
  const encEmail = await encryptWithPublicKey(email);
  const encPassword = await encryptWithPublicKey(password);

  // Send ALL common keys to cover backend variations
  const body = {
    email: encEmail,      // <- new/likely expected
    username: encEmail,   // <- legacy
    mail: encEmail,       // <- legacy
    password: encPassword,
  };

  // eslint-disable-next-line no-console
  console.log("[registerUser] URL:", `${AUTH_URL}/register`);
  // eslint-disable-next-line no-console
  console.log("[registerUser] Payload lengths:", {
    email: body.email.length,
    username: body.username.length,
    mail: body.mail.length,
    password: body.password.length,
  });

  return postWithKeyRetry(`${AUTH_URL}/register`, body);
}

/** Authenticates a user and stores the JWT token. */
export async function loginUser(email: string, password: string): Promise<any> {
  const encEmail = await encryptWithPublicKey(email);
  const encPassword = await encryptWithPublicKey(password);

  // Send BOTH names so backend finds the right one
  const body = {
    email: encEmail,      // <- new/likely expected
    username: encEmail,   // <- legacy
    password: encPassword,
  };

  // eslint-disable-next-line no-console
  console.log("[loginUser] URL:", `${AUTH_URL}/login`);
  // eslint-disable-next-line no-console
  console.log("[loginUser] Payload lengths:", {
    email: body.email.length,
    username: body.username.length,
    password: body.password.length,
  });

  const data = await postWithKeyRetry(`${AUTH_URL}/login`, body);
  localStorage.setItem("token", data.token);
  return data;
}
