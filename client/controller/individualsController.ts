import { API_BASE_URL } from "../utils/config";

/**
 * Create a new individual for the logged-in account.
 * @param data Individual details
 * @returns Newly created individual
 * @throws Error if request fails
 */
export async function createIndividualAPI(data: {
  name: string;
  age: number;
  county: string;
  gender: "male" | "female" | "none";
}): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");

  const payload = JSON.parse(atob(token.split(".")[1]));
  const accountId = payload.id;

  const res = await fetch(`${API_BASE_URL}/individuals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, accountId }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Failed to create individual");

  return result.individual;
}
