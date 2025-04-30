import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('APP STARTED ON PORT 3000');
});