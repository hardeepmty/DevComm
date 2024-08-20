const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const cors = require('cors') ;

dotenv.config();

const app = express();


connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: "hello Ji" });
});

app.use("/api/user", userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})