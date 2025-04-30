import mongoose from "mongoose";

const schema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, min: 2 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bought_tickets: { type: [String], required: true },
  money_balance: { type: Number, required: true }
});

export default mongoose.model("User", schema);