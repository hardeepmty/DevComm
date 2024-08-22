import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const Home = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // State to handle loading
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user for chat
  const [chat, setChat] = useState(null); // State to store chat messages
  const [message, setMessage] = useState(''); // State to store current message
  const [socket, setSocket] = useState(null); // State to handle socket connection

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch users
        const usersResponse = await axios.get('http://localhost:5000/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (usersResponse.data.success) {
          const usersWithFollowStatus = usersResponse.data.users.map(user => ({
            ...user,
            isFollowing: user.isFollowing !== undefined ? user.isFollowing : false,
          }));

          setUsers(usersWithFollowStatus);
        } else {
          alert('Failed to fetch users');
        }

        // Fetch posts
        const postsResponse = await axios.get('http://localhost:5000/api/post/allPosts', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (postsResponse.data.success) {
          setPosts(postsResponse.data.posts);
        } else {
          alert('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPosts();
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Connect to the server
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleFollowUnfollow = async (userId, isFollowing) => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const endpoint = isFollowing
        ? 'http://localhost:5000/api/user/unfollow'
        : 'http://localhost:5000/api/user/follow';

      const payload = isFollowing
        ? { userIdToUnfollow: userId }
        : { userIdToFollow: userId };

      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, isFollowing: !isFollowing } : user
          )
        );
      } else {
        alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
      }
    } catch (error) {
      console.error(`Error during ${isFollowing ? 'unfollow' : 'follow'}:`, error);
      alert(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
    }
  };

  const fetchChat = async (userId) => {
    const token = localStorage.getItem('token');
    const loggedInUserId = localStorage.getItem('userId'); // Assuming you store the logged-in user's ID

    try {
      const chatResponse = await axios.get(`http://localhost:5000/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (chatResponse.data.success) {
        setSelectedUser(userId);
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

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;

    const token = localStorage.getItem('token');
    const loggedInUserId = localStorage.getItem('userId'); // Assuming you store the logged-in user's ID

    try {
      const sendMessageResponse = await axios.post(
        `http://localhost:5000/api/chat/${selectedUser}`,
        { text: message },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (sendMessageResponse.data.success) {
        socket.emit('sendMessage', {
          userId: loggedInUserId,
          targetUserId: selectedUser,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (users.length === 0 && posts.length === 0) {
    return <div>No users or posts found</div>;
  }

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id} style={{ marginBottom: '20px' }}>
            <Link to={`/profile/${user._id}`}>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={`${user.username}'s profile`}
                  width="50"
                  height="50"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {user.username}
                {user.openToWork && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'green',
                      display: 'inline-block',
                      marginLeft: '5px',
                    }}
                    title="Open to Work"
                  />
                )}
              </span>
            </Link>
            <p>Email: {user.email}</p>
            <p>Bio: {user.bio}</p>
            <p>GitHub: {user.github}</p>
            <button
              onClick={() => handleFollowUnfollow(user._id, user.isFollowing)}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button onClick={() => fetchChat(user._id)}>Chat</button>
          </li>
        ))}
      </ul>

      <h1>All Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <p>Author: {post.author.username}</p>
            <p>{post.caption}</p>
            <p>Likes: {post.likes.length}</p>
          </li>
        ))}
      </ul>

      {/* Chat section */}
      {selectedUser && chat && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2>Chat with {users.find(user => user._id === selectedUser)?.username}</h2>
          <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chat.messages.map((msg, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{msg.sender.username}: </strong>
                <span>{msg.text}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: '10px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, marginRight: '10px' }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
