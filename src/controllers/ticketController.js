import { v4 as uuidv4 } from "uuid";
import TicketModel from "../models/ticketModel.js";

const NEW_TICKET = async (req, res) => {
  try {
    const ticket = new TicketModel({
      id: uuidv4(),
      title: req.body.title,
      ticket_price: req.body.ticket_price,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url || ""
    });
    const saved = await ticket.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Ticket creation failed" });
  }
};

const GET_TICKETS = async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    res.status(200).json(tickets);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to load tickets" });
  }
};

const GET_TICKET_BY_ID = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ id: req.params.id });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error loading ticket" });
  }
};

export { NEW_TICKET, GET_TICKETS, GET_TICKET_BY_ID };