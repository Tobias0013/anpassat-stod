import { readFileSync } from "fs";
import { join } from "path";
import * as crypto from "crypto";

const privateKeyPath = join(__dirname, "..", "..", "..", "dist-server", "keys", "private.pem");
const privateKey = readFileSync(privateKeyPath, "utf-8");

/**
 * Decrypts a base64 ciphertext using RSA-OAEP with SHA-256.
 *
 * @param encryptedField Base64-encoded ciphertext.
 * @returns UTF-8 plaintext.
 */
export const decryptField = (encryptedField: string): string => {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedField, "base64")
  );
  return decrypted.toString("utf8");
};
