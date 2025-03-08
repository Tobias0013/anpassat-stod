import "dotenv/config";

/**
 * Retrieves the port number from the environment variables.
 * If the port is not defined or is not an integer, the process will be stopped with an error message.
 *
 * @returns {number} The port number as an integer.
 */
 export const port = () => {
  const port = process.env.PORT;
  if (!port || Number.isInteger(port)) {
    stopProcess("Missing appropriate PORT in environment file");
    return -1;
  }
  return Number.parseInt(port);
}

/**
 * Logs an error message to the console and stops the process.
 *
 * @param {string} message - The error message to be logged.
 */
function stopProcess(message: string) {
  console.error(message);
  process.exit(0);
}
