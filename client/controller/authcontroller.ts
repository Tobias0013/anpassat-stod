import { encryptWithPublicKey } from "../utils/encryption";

/**
 * Base URL for API calls.
 *
 * Resolution order:
 * 1. Vite environment variable (VITE_API_URL)
 * 2. Create React App environment variable (REACT_APP_API_URL)
 * 3. Fallback to current host with port 3000 (for local development)
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) ||
  `${window.location.protocol}//${window.location.hostname}:3000`;

const AUTH_URL = `${BASE_URL}/auth`;

/**
 * Registers a new user account by encrypting fields before sending to the backend.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<any>} The backend response data.
 * @throws {Error} If registration fails or the server returns an error.
 */
export async function registerUser(email: string, password: string): Promise<any> {
  console.log("registerUser called");

  try {
    const body = {
      username: await encryptWithPublicKey(email),
      mail: await encryptWithPublicKey(email),
      password: await encryptWithPublicKey(password),
    };

    console.log("Encrypted body to send:", body);

    const res = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Server error during registration");
    }

    const data = await res.json();
    console.log("Registration success:", data);
    return data;
  } catch (err: any) {
    console.error("Error during registerUser:", err);
    throw err;
  }
}

/**
 * Authenticates a user by encrypting login credentials and retrieves a JWT token from the backend.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<any>} The backend response containing the JWT token.
 * @throws {Error} If login fails or the server returns an error response.
 *
 * @example
 * ```ts
 * const result = await loginUser("test@example.com", "securePassword");
 * const token = localStorage.getItem("token");
 * ```
 */
export async function loginUser(email: string, password: string): Promise<any> {
  console.log("loginUser called");

  try {
    const body = {
      username: await encryptWithPublicKey(email),
      password: await encryptWithPublicKey(password),
    };

    console.log("Encrypted login body:", body);

    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Authentication failed");
    }

    const data = await res.json();
    console.log("Login success:", data);

    // Save JWT token to localStorage for future authenticated requests
    localStorage.setItem("token", data.token);

    return data;
  } catch (err: any) {
    console.error("Error during loginUser:", err);
    throw err;
  }
}
