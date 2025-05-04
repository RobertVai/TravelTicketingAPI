import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import TicketModel from "../models/ticketModel.js";

const NEW_USER = async (req, res) => {
  const data = req.body;

  if (!data.email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const formattedName = data.name.charAt(0).toUpperCase() + data.name.slice(1);

  if (data.password.length < 6 || !/\d/.test(data.password)) {
    return res
      .status(400)
      .json({
        message: "Password must contain at least 6 characters and one digit",
      });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(data.password, salt);

  const user = {
    id: uuidv4(),
    name: formattedName,
    email: data.email,
    password: passwordHash,
    bought_tickets: [],
    money_balance: data.money_balance || 0,
  };

  try {
    const response = await new UserModel(user);
    const createdUser = await response.save();

    const jwt_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    const jwt_refresh_token = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Registration successful",
      user: createdUser,
      jwt_token,
      jwt_refresh_token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

const GET_USERS = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to load users" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.body.userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error loading user" });
  }
};

const SIGN_IN = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Wrong email or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Wrong email or password" });
    }

    const jwt_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    const jwt_refresh_token = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Logged in successfully",
      jwt_token,
      jwt_refresh_token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

const GET_AUTH_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: 1 });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

const PURCHASE_TICKET = async (req, res) => {
  const userId = req.body.userId;
  const ticketId = new mongoose.Types.ObjectId(req.params.ticketId);

  try {
    const user = await UserModel.findOne({ id: userId });
    const ticket = await TicketModel.findOne({ _id: ticketId });

    if (!user || !ticket) {
      return res.status(404).json({ message: "User or ticket not found" });
    }

    if (user.money_balance < ticket.ticket_price) {
      return res
        .status(400)
        .json({ message: "Insufficient funds to purchase ticket" });
    }

    user.money_balance -= ticket.ticket_price;
    user.bought_tickets.push(ticket._id);

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Ticket successfully purchased",
      updated_balance: updatedUser.money_balance,
      bought_tickets: updatedUser.bought_tickets,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error processing ticket purchase" });
  }
};

const GET_NEW_JWT_TOKEN = async (req, res) => {
  const { jwt_refresh_token } = req.body;

  try {
    const checkToken = jwt.verify(
      jwt_refresh_token,
      process.env.JWT_REFRESH_SECRET
    );
    const newToken = jwt.sign({ id: checkToken.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      message: "New token generated",
      jwt_token: newToken,
      jwt_refresh_token,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong or token expired, try signing in again",
    });
  }
};

const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "ticket_info",
        },
      },
    ]);

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load users with ticket info" });
  }
};

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  const userId = req.body.userId;

  try {
    const userWithTickets = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "ticket_info",
        },
      },
    ]);

    if (!userWithTickets || userWithTickets.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userWithTickets[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load user with ticket info" });
  }
};

export {
  NEW_USER,
  GET_USERS,
  GET_USER_BY_ID,
  SIGN_IN,
  GET_NEW_JWT_TOKEN,
  GET_AUTH_USERS,
  PURCHASE_TICKET,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
};
