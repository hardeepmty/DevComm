const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initSocket = require('./socket/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

connectDB();

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: "hello Ji" }));

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
