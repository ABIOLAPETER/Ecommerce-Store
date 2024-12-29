import express from 'express';
import { dbConnect } from './config/dbConnect.js';
import Routes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import upload from "express-fileupload"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(upload())

dbConnect();

// Use auth routes
app.use(morgan('dev'));
app.use('/api/v1/E-Commerce', Routes);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log(`Server is running at http://localhost:${PORT}`)
});
