/**
 * Auth controller: register & login with encrypted fields.
 * Retries once on HTTP 500 by refreshing the public key (handles key rotation).
 */
import { encryptWithPublicKey, refreshPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 500);
  }
  return (await res.text().catch(() => "")).slice(0, 500);
}

async function postWithKeyRetry(url: string, body: any): Promise<any> {
  const attempt = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  let res = await attempt();
  if (res.status === 500) {
    await refreshPublicKey();
    res = await attempt();
  }

  if (!res.ok) {
    const msg = await readError(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Registers a new user (fields encrypted client-side). */
export async function registerUser(email: string, password: string): Promise<any> {
  // If your backend expects `email` (not `mail`), uncomment the email line.
  const body: Record<string, string> = {
    username: await encryptWithPublicKey(email),
    mail: await encryptWithPublicKey(email),
    // email: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };
  return postWithKeyRetry(`${AUTH_URL}/register`, body);
}

/** Authenticates a user and stores the JWT token. */
export async function loginUser(email: string, password: string): Promise<any> {
  // If your backend expects `email` (not `username`), uncomment the email line.
  const body: Record<string, string> = {
    username: await encryptWithPublicKey(email),
    // email: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };
  const data = await postWithKeyRetry(`${AUTH_URL}/login`, body);
  localStorage.setItem("token", data.token);
  return data;
}
