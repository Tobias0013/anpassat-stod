import forge from "node-forge";

let cachedKey: forge.pki.rsa.PublicKey | null = null;
const BASE_URL = `http://localhost:${process.env.PORT}`;

/**
 * Retrieves and caches the public RSA key from the backend.
 *
 * @returns {Promise<forge.pki.rsa.PublicKey>} The imported public key.
 *
 * @throws {Error} If the fetch or key import fails.
 */
async function getCachedPublicKey(): Promise<forge.pki.rsa.PublicKey> {
  if (cachedKey) return cachedKey;

  const res = await fetch(`${BASE_URL}/public-key`);
  const { publicKey } = await res.json();

  console.log("Raw public key from server:", publicKey);

  cachedKey = forge.pki.publicKeyFromPem(publicKey) as forge.pki.rsa.PublicKey;
  return cachedKey;
}

/**
 * Encrypts a string using the server's RSA public key.
 *
 * @param {string} plaintext - The text to encrypt.
 * @returns {Promise<string>} The base64-encoded encrypted string.
 *
 * @throws {Error} If encryption fails.
 */
export async function encryptWithPublicKey(plaintext: string): Promise<string> {
  const key = await getCachedPublicKey();

  const encrypted = key.encrypt(plaintext, "RSAES-PKCS1-V1_5");
  return forge.util.encode64(encrypted);
}
