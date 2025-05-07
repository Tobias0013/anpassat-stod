import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { generateKeyPairSync } from 'crypto';
import { join } from 'path';

/**
 * The directory path for the keys.
 *
 * @remarks
 * This path is relative to the current file's directory.
 */
const keyDir = join(__dirname, '../../keys');
if (!existsSync(keyDir)) {
  mkdirSync(keyDir);
}

/**
 * Generates a key pair using the RSA algorithm.
 *
 * @param algorithm - The algorithm to use for key generation.
 * @param options - The options for key generation.
 * @returns An object containing the generated public and private keys.
 */
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  }
});

writeFileSync(join(keyDir, 'public.pem'), publicKey);
writeFileSync(join(keyDir, 'private.pem'), privateKey);

console.log("Keys generated and saved to keys directory");

