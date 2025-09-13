import forge from "node-forge";
import { API_BASE_URL } from "../utils/config";

/**
 * Cached RSA public key to avoid fetching/parsing multiple times.
 */
let cachedKey: forge.pki.rsa.PublicKey | null = null;

/**
 * Endpoint URL for retrieving the server's RSA public key.
 */
const KEY_URL = `${API_BASE_URL}/public-key`;

/**
 * Normalizes a public key string into a valid PEM format.
 *
 * - If the string already contains proper PEM with newlines → returned as-is.
 * - If it contains header/footer but no newlines → rewraps the body at 64-char lines.
 * - If it is only base64 (no header/footer) → wraps it into a PEM.
 * - Otherwise returns the original string (forge will throw if invalid).
 *
 * @param {string} pemLike - Raw key string from the backend.
 * @returns {string} Normalized PEM string ready for forge import.
 */
function normalizePem(pemLike: string): string {
  const header = "-----BEGIN PUBLIC KEY-----";
  const footer = "-----END PUBLIC KEY-----";

  let s = (pemLike || "").trim().replace(/\r/g, "");

  // Case 1: Already has newlines and looks like a PEM
  if (s.includes("\n") && s.includes(header) && s.includes(footer)) {
    return s;
  }

  // Case 2: Has header/footer but no newlines → rewrap body
  if (s.includes(header) && s.includes(footer)) {
    const body = s.replace(header, "").replace(footer, "").replace(/[\s\n\r-]+/g, "");
    const chunks = body.match(/.{1,64}/g) || [];
    return `${header}\n${chunks.join("\n")}\n${footer}`;
  }

  // Case 3: Pure base64 string → wrap into PEM
  if (/^[A-Za-z0-9+/=]+$/.test(s)) {
    const chunks = s.match(/.{1,64}/g) || [];
    return `${header}\n${chunks.join("\n")}\n${footer}`;
  }

  // Case 4: Unknown format → return as-is (forge will error)
  return s;
}

/**
 * Fetches and caches the RSA public key from the backend.
 *
 * @async
 * @returns {Promise<forge.pki.rsa.PublicKey>} The parsed public key object.
 * @throws {Error} If the fetch fails or the key is invalid.
 */
async function getCachedPublicKey(): Promise<forge.pki.rsa.PublicKey> {
  if (cachedKey) return cachedKey;

  const res = await fetch(KEY_URL);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Failed to fetch public key: ${res.status} ${msg}`);
  }

  const { publicKey } = await res.json();
  const pem = normalizePem(publicKey);

  console.log("Normalized PEM from server:", pem);

  cachedKey = forge.pki.publicKeyFromPem(pem) as forge.pki.rsa.PublicKey;
  return cachedKey;
}

/**
 * Encrypts a plaintext string with the server's RSA public key.
 *
 * - Retrieves and caches the public key on first use.
 * - Uses RSAES-PKCS1-V1_5 padding.
 * - Returns the encrypted value as a base64-encoded string.
 *
 * @async
 * @param {string} plaintext - The string to encrypt.
 * @returns {Promise<string>} The encrypted string, base64 encoded.
 * @throws {Error} If encryption fails or key retrieval fails.
 */
export async function encryptWithPublicKey(plaintext: string): Promise<string> {
  const key = await getCachedPublicKey();
  const encrypted = key.encrypt(plaintext, "RSAES-PKCS1-V1_5");
  return forge.util.encode64(encrypted);
}
