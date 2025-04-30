import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/userModel.js";

const INSERT_USER = async (req, res) => {
  try {
    const user = new UserModel({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      bought_tickets: [],
      money_balance: req.body.money_balance || 0
    });
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "User creation failed" });
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
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error loading user" });
  }
};

export { INSERT_USER, GET_USERS, GET_USER_BY_ID };