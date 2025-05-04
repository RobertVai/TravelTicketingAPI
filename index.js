import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';



const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('APP STARTED ON PORT 3000'));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
  });