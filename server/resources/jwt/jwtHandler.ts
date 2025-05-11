import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

/**
 * Signs a JSON Web Token (JWT) with the provided payload.
 * @param payload - The data to be included in the JWT.
 * @returns The signed JWT as a string.
 * @throws Error if JWT secret is not defined in the environment.
 */
export function signJwt(payload: any): string {
  if (!secret) {
    throw new Error('JWT secret is not defined in the environment');
  }

  return jwt.sign(payload, secret, { expiresIn: "1hr" });
}

/**
 * Verifies a JSON Web Token (JWT).
 *
 * @param token - The JWT to be verified.
 * @returns The decoded payload of the JWT.
 * @throws Error if the JWT secret is not defined in the environment.
 */
export function verifyJwt(token: string): any {
  if (!secret) {
    throw new Error('JWT secret is not defined in the environment');
  }

  return jwt.verify(token, secret);
}