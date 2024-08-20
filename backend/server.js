const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser'); 

const cors = require('cors') ;

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: "hello Ji" });
});

app.use("/api/user", userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})