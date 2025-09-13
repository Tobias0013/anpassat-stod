import forge from "node-forge";
import { API_BASE_URL } from "../utils/config";

/**
 * Cachead publik RSA-nyckel.
 */
let cachedKey: forge.pki.rsa.PublicKey | null = null;

const KEY_URL = `${API_BASE_URL}/public-key`;

/**
 * Normaliserar PEM (hanterar både PKCS#8 "BEGIN PUBLIC KEY" och PKCS#1 "BEGIN RSA PUBLIC KEY").
 */
function normalizePem(pemLike: string): string {
  const header1 = "-----BEGIN PUBLIC KEY-----";
  const footer1 = "-----END PUBLIC KEY-----";
  const header2 = "-----BEGIN RSA PUBLIC KEY-----";
  const footer2 = "-----END RSA PUBLIC KEY-----";
  let s = (pemLike || "").trim().replace(/\r/g, "");
  const has1 = s.includes(header1) && s.includes(footer1);
  const has2 = s.includes(header2) && s.includes(footer2);

  if (has1 || has2) {
    const body = s
      .replace(header1, "")
      .replace(footer1, "")
      .replace(header2, "")
      .replace(footer2, "")
      .replace(/[\s\n\r-]+/g, "");
    const chunks = body.match(/.{1,64}/g) || [];
    const h = has2 ? header2 : header1;
    const f = has2 ? footer2 : footer1;
    return `${h}\n${chunks.join("\n")}\n${f}`;
  }
  if (/^[A-Za-z0-9+/=]+$/.test(s)) {
    const chunks = s.match(/.{1,64}/g) || [];
    return `${header1}\n${chunks.join("\n")}\n${footer1}`;
  }
  return s;
}

/**
 * Hämtar och cachar publik nyckel (cache-bust för att undvika gamla nycklar).
 */
async function fetchPublicKeyFresh(): Promise<forge.pki.rsa.PublicKey> {
  const res = await fetch(`${KEY_URL}?t=${Date.now()}`, { cache: "no-store" as RequestCache });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch public key: ${res.status} ${text.slice(0, 300)}`);
  }
  const { publicKey } = await res.json();
  const pem = normalizePem(publicKey);
  return forge.pki.publicKeyFromPem(pem) as forge.pki.rsa.PublicKey;
}

/**
 * Returnerar cachead nyckel, eller hämtar ny.
 */
export async function getCachedPublicKey(): Promise<forge.pki.rsa.PublicKey> {
  if (cachedKey) return cachedKey;
  cachedKey = await fetchPublicKeyFresh();
  return cachedKey;
}

/**
 * Tvingar en ny hämtning av publik nyckel (vid fel).
 */
export async function refreshPublicKey(): Promise<void> {
  cachedKey = await fetchPublicKeyFresh();
}

/**
 * Krypterar text med serverns publika nyckel.
 */
export async function encryptWithPublicKey(plaintext: string): Promise<string> {
  const key = await getCachedPublicKey();
  const encrypted = key.encrypt(plaintext, "RSAES-PKCS1-V1_5");
  return forge.util.encode64(encrypted);
}
