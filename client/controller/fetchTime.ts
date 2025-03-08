
/**
 * Fetches the current time from the server.
 *
 * This function makes a GET request to the endpoint "http://localhost:3000/tmp"
 * and returns the response as a JSON object.
 *
 * @returns {Promise<any>} A promise that resolves to the JSON response from the server,
 * or null if an error occurs.
 *
 * @throws {Error} If the fetch operation fails.
 */
export default async function fetchTime(): Promise<any> {
    try{
        const resp = await (await fetch("http://localhost:3000/tmp")).json();
        console.log(resp);
        
        return resp;
    }   
    catch (e){
        console.error(e);
        return null;
    } 
}