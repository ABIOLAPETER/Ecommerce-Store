import express from 'express';
import { dbConnect } from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

dbConnect();

// Use auth routes
app.use(morgan('dev'));
app.use('/api/v1/E-Commerce/user', authRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log(`Server is running at http://localhost:${PORT}`)
});
