const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const chatRoutes = require('./routes/chatRoutes');
const cookieParser = require('cookie-parser'); 

//socket
const http = require('http');
const initSocket = require('./socket/socket');

const cors = require('cors') ;


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

app.get('/', (req, res) => {
  return res.json({ message: "hello Ji" });
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes) ;
app.use("/api/chat", chatRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})