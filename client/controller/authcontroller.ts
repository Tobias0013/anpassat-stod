// auth.ts
import { encryptWithPublicKey, refreshPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/** Read a short error message from a Response (JSON or text). */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 800);
  }
  return (await res.text().catch(() => "")).slice(0, 800);
}

/**
 * POST helper that retries once after refreshing the public key if HTTP 500 occurs.
 * @param url Target endpoint
 * @param body JSON body
 */
async function postWithKeyRetry(url: string, body: unknown): Promise<any> {
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

/**
 * Register a new user (email & password encrypted client-side).
 * @param email Plain email
 * @param password Plain password
 */
export async function registerUser(email: string, password: string): Promise<any> {
  const encEmail = await encryptWithPublicKey(email);
  const encPassword = await encryptWithPublicKey(password);

  const body = {
    email: encEmail,
    username: encEmail,
    mail: encEmail,
    password: encPassword,
  };

  return postWithKeyRetry(`${AUTH_URL}/register`, body);
}

/**
 * Log in a user (credentials encrypted) and store the returned JWT.
 * @param email Plain email
 * @param password Plain password
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const encEmail = await encryptWithPublicKey(email);
  const encPassword = await encryptWithPublicKey(password);

  const body = {
    email: encEmail,
    username: encEmail,
    password: encPassword,
  };

  const data = await postWithKeyRetry(`${AUTH_URL}/login`, body);
  localStorage.setItem("token", data.token);
  return data;
}
