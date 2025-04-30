import express from "express";
import { INSERT_TICKET, GET_TICKETS, GET_TICKET_BY_ID } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", INSERT_TICKET);
router.get("/", GET_TICKETS);
router.get("/:id", GET_TICKET_BY_ID);

export default router;