import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/Chat.css'; // Import a CSS file for styles

const Chat = () => {
  const { userId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInUserId = localStorage.getItem('userId');

    if (!token || !loggedInUserId) {
      window.location.href = '/login';
      return;
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      const token = localStorage.getItem('token');
      const loggedInUserId = localStorage.getItem('userId');

      const fetchChat = async () => {
        try {
          const chatResponse = await axios.get(`http://localhost:5000/api/chat/chat/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });

          if (chatResponse.data.success) {
            setChat(chatResponse.data.chat);
            socket.emit('joinRoom', { userId: loggedInUserId, targetUserId: userId });
          } else {
            alert('Failed to fetch chat');
          }
        } catch (error) {
          console.error('Error fetching chat:', error);
          alert('Failed to fetch chat');
        }
      };

      fetchChat();
    }
  }, [socket, userId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const token = localStorage.getItem('token');
    const loggedInUserId = localStorage.getItem('userId');

    try {
      const sendMessageResponse = await axios.post(
        `http://localhost:5000/api/chat/chat/${userId}`,
        { text: message },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (sendMessageResponse.data.success) {
        socket.emit('sendMessage', {
          userId: loggedInUserId,
          targetUserId: userId,
          text: message,
        });

        setChat(sendMessageResponse.data.chat);
        setMessage(''); // Clear the message input
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (newMessage) => {
        setChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      });
    }
  }, [socket]);

  if (!chat) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>{chat.participants[1].username}</h1>
      </div>
      <div className="chat-messages">
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-input-container" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;
