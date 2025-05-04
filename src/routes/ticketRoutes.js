import express from "express";
import {
  NEW_TICKET,
  GET_TICKETS,
  GET_TICKET_BY_ID,
  CREATE_TICKET,
} from "../controllers/ticketController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

router.post("/", NEW_TICKET);
router.get("/", GET_TICKETS);
router.get("/:id", GET_TICKET_BY_ID);
router.post("/createTicket", authUser, CREATE_TICKET);

export default router;
