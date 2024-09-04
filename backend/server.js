const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const jobRoutes= require('./routes/jobRoutes')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const initSocket = require('./socket/socket');


const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path')


dotenv.config();

const app = express();

app.use(bodyParser.json());

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
app.use("/api/job",jobRoutes) ;



app.post('/execute', (req, res) => {
  const { language, code } = req.body;  
  let command;

  if (language === 'javascript') {
    command = `node -e "${code.replace(/"/g, '\\"')}"`;
  } else if (language === 'python') {
    command = `python -c "${code.replace(/"/g, '\\"')}"`;
  } else if (language === 'c_cpp') {
    const tempFilePath = path.join(__dirname, 'temp.cpp');  
    fs.writeFileSync(tempFilePath, code);  

    if (os.platform() === 'win32') {
      command = `g++ ${tempFilePath} -o temp && temp.exe`;
    } else {
      command = `g++ ${tempFilePath} -o temp && ./temp`;
    }
  }

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      // If there is an error during execution, send the error message
      res.json({ output: stderr || error.message });
      return;
    }
    // Send the standard output of the executed code
    res.json({ output: stdout });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
