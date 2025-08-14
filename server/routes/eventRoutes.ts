import { Router } from "express";
import { getEvents, createEvent } from "../controller/database/eventController";

const router = Router();

router.get("/events/:id", getEvents)
router.post("/register", createEvent);

export default router;
