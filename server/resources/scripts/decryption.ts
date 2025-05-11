import { readFileSync } from 'fs';
import { join } from 'path';
import * as crypto from "crypto";

const privateKeyPath = join(__dirname, "..", "..", "keys", "private.pem");
const privateKey = readFileSync(privateKeyPath, "utf-8");

/**
 * Decrypts an encrypted field using the private key.
 * 
 * @param encryptedField - The encrypted field to be decrypted.
 * @returns The decrypted field as a string.
 */
export const decryptField = (encryptedField: string): string => {
  return crypto.privateDecrypt(
      {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedField, 'base64')
  ).toString('utf8');
}