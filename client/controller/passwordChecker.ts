// Author: Tobias Vinblad
import { passwordStrength } from "check-password-strength";

/**
 * An array of password strength options, each with specific criteria.
 * 
 * Each option includes:
 * - `id`: A unique identifier for the password strength level.
 * - `value`: A string representing the description of the password strength.
 * - `minDiversity`: The minimum number of character types (e.g., lowercase, uppercase, digits, symbols) required.
 * - `minLength`: The minimum length required for the password.
 */
const passwordOptions = [
  {
    id: 0,
    value: "Too weak",
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: 1,
    value: "Weak",
    minDiversity: 2,
    minLength: 8,
  },
  {
    id: 2,
    value: "Good",
    minDiversity: 3,
    minLength: 8,
  },
  {
    id: 3,
    value: "Strong",
    minDiversity: 4,
    minLength: 12,
  },
];

/**
 * Evaluates the strength of a given password based on predefined options.
 *
 * @param password - The password string to be evaluated.
 * @returns The strength of the password.
 */
export function getPasswordStrength(password: string) {
  return passwordStrength(password, passwordOptions as any);
}

/**
 * Checks if the provided password is valid based on its strength.
 *
 * @param password - The password string to be validated.
 * @returns A boolean indicating whether the password is valid (true) or not (false).
 */
export function validPassowrd(password: string): boolean {
  const strength = getPasswordStrength(password);
  if (strength.id <= 0) {
    return false;
  }
  return true;
}
