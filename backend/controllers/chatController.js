const Chat = require('../models/chat');
const User = require('../models/user');

exports.getChat = async (req, res) => {
  const { userId } = req.params;
  const loggedInUser = req.user_;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUser, userId] },
    }).populate('messages.sender');

    if (!chat) {
      chat = new Chat({ participants: [loggedInUser, userId], messages: [] });
      await chat.save();
    }

    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching chat' });
  }
};

exports.sendMessage = async (req, res) => {
  const { userId } = req.params;
  const { text } = req.body;
  const loggedInUser = req.user_;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [loggedInUser, userId] },
    });

    if (chat) {
      chat.messages.push({ sender: loggedInUser, text });
      await chat.save();
      res.json({ success: true, chat });
    } else {
      res.status(404).json({ success: false, message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};
