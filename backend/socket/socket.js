const socketIO = require('socket.io');
const Chat = require('../models/chat')

const initSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ userId, targetUserId }) => {
      const room = [userId, targetUserId].sort().join('-');
      socket.join(room);
      console.log(`User ${userId} joined room ${room}`);
    });

    socket.on('sendMessage', async ({ userId, targetUserId, text }) => {
      const room = [userId, targetUserId].sort().join('-');

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (chat) {
          const message = { sender: userId, text };
          chat.messages.push(message);
          await chat.save();

          io.to(room).emit('receiveMessage', message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io; // Return io to use in the app
};

module.exports = initSocket;
