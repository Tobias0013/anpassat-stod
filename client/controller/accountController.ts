/**
 * Base URL for API calls.
 *
 * Resolution order:
 * 1. Vite environment variable (VITE_API_URL)
 * 2. Create React App environment variable (REACT_APP_API_URL)
 * 3. Fallback to current host with port 3000 (useful for local development)
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && (process as any).env?.REACT_APP_API_URL) ||
  `${window.location.protocol}//${window.location.hostname}:3000`;

/**
 * Fetches individuals associated with the currently logged-in account.
 *
 * Reads the JWT from localStorage, decodes the account ID,
 * and performs an authenticated request to the backend.
 *
 * @returns {Promise<any[]>} A promise resolving to an array of individual objects.
 * @throws {Error} If no token is found, the token is invalid, or the request fails.
 */
export async function fetchAccountIndividuals(): Promise<any[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. User not authenticated.");
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const accountId = payload.id;

  console.log("Calling URL:", `${BASE_URL}/accounts/${accountId}/individuals`);

  const response = await fetch(`${BASE_URL}/accounts/${accountId}/individuals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to fetch individuals";
    try {
      const error = await response.json();
      if (error?.message) message = error.message;
    } catch {
      // Ignore parsing error, keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data.individuals;
}
