import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      const token = localStorage.getItem('token');
      const loggedInUserId = localStorage.getItem('userId'); // Retrieve userId
      console.log(loggedInUserId)

      if (!token || !loggedInUserId) {
        window.location.href = '/login';
        return;
      }

      try {
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
    const newSocket = io('http://localhost:5000');
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
    const loggedInUserId = localStorage.getItem('userId'); // Retrieve userId here
    console.log('Logged In User ID:', loggedInUserId); // Debug output

    try {
      const chatResponse = await axios.get(`http://localhost:5000/api/chat/chat/${userId}`, {
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
    const loggedInUserId = localStorage.getItem('userId'); // Retrieve userId here

    try {
      const sendMessageResponse = await axios.post(
        `http://localhost:5000/api/chat/chat/${selectedUser}`,
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
          <ul style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            {chat.messages.map((msg, index) => (
              <li key={index} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                <strong>{msg.senderId === selectedUser ? 'Them' : 'You'}:</strong> {msg.text}
              </li>
            ))}
          </ul>
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ width: 'calc(100% - 90px)', marginRight: '10px' }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};


export default Home;
