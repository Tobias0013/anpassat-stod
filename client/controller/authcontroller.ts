import { encryptWithPublicKey, refreshPublicKey } from "../utils/encryption";
import { API_BASE_URL } from "../utils/config";

const AUTH_URL = `${API_BASE_URL}/auth`;

/**
 * Läser feltext från Response (JSON eller text).
 */
async function readError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => ({}));
    return j?.message || JSON.stringify(j).slice(0, 500);
  }
  return (await res.text().catch(() => "")).slice(0, 500);
}

/**
 * Skickar request, och om servern svarar 500 första gången
 * så uppdaterar vi publik nyckel och försöker en gång till.
 */
async function postWithKeyRetry(url: string, body: any): Promise<any> {
  const attempt = async () =>
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
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Registrerar ny användare (krypterat).
 */
export async function registerUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    mail: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };
  // Tips: om backend egentligen förväntar 'email', testa att lägga till:
  // body.email = await encryptWithPublicKey(email);

  return postWithKeyRetry(`${AUTH_URL}/register`, body);
}

/**
 * Loggar in och sparar JWT.
 */
export async function loginUser(email: string, password: string): Promise<any> {
  const body = {
    username: await encryptWithPublicKey(email),
    password: await encryptWithPublicKey(password),
  };
  // Tips: om backend egentligen förväntar 'email', testa att lägga till:
  // body.email = await encryptWithPublicKey(email);

  const data = await postWithKeyRetry(`${AUTH_URL}/login`, body);
  localStorage.setItem("token", data.token);
  return data;
}
