/**
 * Express router for handling temporary routes.
 *
 * @module routes/tmp
 */

import { Router } from "express";

const tmp = Router();

/**
 * GET /
 *
 * Route serving the current server time.
 *
 * @name GetTime
 * @route {GET} /
 * @returns {Object} JSON object containing the current server time.
 */
tmp.get("/", (req, res) => {
  const date = new Date();
  res.json({ date: date.toLocaleTimeString() });
});

export default tmp;
