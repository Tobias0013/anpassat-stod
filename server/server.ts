/**
 * This module sets up and starts an Express server.
 *
 * It imports necessary modules including express, configuration settings, routes, and CORS middleware.
 *
 * The server is configured to:
 * - Parse JSON and URL-encoded request bodies
 * - Serve static files from the "dist" directory
 * - Use CORS middleware to handle Cross-Origin Resource Sharing
 * - Use a router for handling different routes
 *
 * The server listens on the port specified in the configuration settings.
 *
 * @module server
 */
import express from "express";
import { port } from "./controller/config";
import router from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(cors());

app.use("/", router);

app.listen(port(), () => {
  console.log(
    `Server started successfully.\nListening on http://localhost:${port()}`
  );
});
