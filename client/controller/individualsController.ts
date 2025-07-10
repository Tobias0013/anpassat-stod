// controller/individualController.ts

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

/**
 * Sends a POST request to create a new individual.
 *
 * @param data - Object containing individual data and accountId.
 * @returns The newly created individual.
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

  const response = await fetch(`${BASE_URL}/individuals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, accountId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create individual");
  }

  return result.individual;
}
