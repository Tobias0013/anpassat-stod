import { encryptWithPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * Registers a new user (fields encrypted client-side).
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<any>} Backend response JSON.
 */
export async function registerUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    mail: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };

  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : { message: (await res.text().catch(() => "")).slice(0, 300) };
    throw new Error(payload.message || `Registration failed (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Authenticates a user and stores the JWT token.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<any>} Backend response JSON.
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };

  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : { message: (await res.text().catch(() => "")).slice(0, 300) };
    throw new Error(payload.message || `Authentication failed (HTTP ${res.status})`);
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}
