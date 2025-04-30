import express from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import ticketRoutes from './src/routes/ticketRoutes.js';
import userRoutes from './src/routes/userRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

app.listen(3000, () => {
  console.log('APP STARTED ON PORT 3000');
});