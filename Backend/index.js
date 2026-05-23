import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectdb.js';
import cookieparser from 'cookie-parser';
import authRouter from './route/authRoute.js';
import courseRouter from './route/courseRoute.js';
import progressRouter from './route/progressRoute.js';
import cors from 'cors';

dotenv.config();

const port = process.env.port || 8000;
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRouter);   
app.use("/api/courses", courseRouter);
app.use("/api/progress", progressRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDB();
});