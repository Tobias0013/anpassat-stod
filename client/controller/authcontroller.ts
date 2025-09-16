/**
 * Auth controller for register & login with encrypted fields.
 */
import { encryptWithPublicKey, refreshPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * Extracts error details from a failed fetch Response.
 */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 800);
  }
  return (await res.text().catch(() => "")).slice(0, 800);
}

/**
 * Performs a POST request, retrying once if the backend returns 500
 * (refreshes the public key to handle rotation).
 */
async function postWithKeyRetry(url: string, body: any): Promise<any> {
  const attempt = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  let res = await attempt();

  if (res.status === 500) {
    console.warn("[auth] 500 received — refreshing public key and retrying once");
    await refreshPublicKey();
    res = await attempt();
  }

  if (!res.ok) {
    const msg = await readError(res);
    console.error(`[auth] ${url} error:`, msg, "Status:", res.status);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Registers a new user (fields encrypted client-side).
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
 * Authenticates a user and stores the JWT token.
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const encEmail = await encryptWithPublicKey(email);
  const encPassword = await encryptWithPublicKey(password);

  const body = {
    email: encEmail,
    username: encEmail,
    password: encPassword,
  };

  // Debug info
  console.group("[loginUser]");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Auth endpoint:", `${AUTH_URL}/login`);
  console.log("Payload lengths:", {
    email: body.email.length,
    username: body.username.length,
    password: body.password.length,
  });
  console.log("Env snapshot:", {
    REACT_APP_API_URL: (process as any)?.env?.REACT_APP_API_URL,
    NODE_ENV: (process as any)?.env?.NODE_ENV,
  });
  console.groupEnd();

  const data = await postWithKeyRetry(`${AUTH_URL}/login`, body);
  localStorage.setItem("token", data.token);
  return data;
}
