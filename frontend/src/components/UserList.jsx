import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import fallbackImage from '/images/user.png'; 
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
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
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.github.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="userlist-loading">Loading...</div>;
  }

  if (users.length === 0) {
    return <div className="userlist-no-users">No users found</div>;
  }

  return (
    <div className="userlist-container" >
      <h1 className="userlist-title">All Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="userlist-search-input"
      />
      <ul className="userlist">
        {filteredUsers.map(user => (
          <li key={user._id} className="userlist-item">
            <Link to={`/profile/${user._id}`} className="userlist-info" style={{textDecoration:"none"}}>
              <img
                src={user.profilePicture || fallbackImage}
                alt={`${user.username}'s profile`}
                className="userlist-profile-picture"
              />
              <span className="userlist-username">
                {user.username}
                {user.openToWork && (
                  <span className="userlist-open-to-work" title="Open to Work" />
                )}
              </span>
            </Link>
            <div className="userlist-buttons">
              <button
                onClick={() => handleFollowUnfollow(user._id, user.isFollowing)}
                className="userlist-follow-button"
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <Link to={`/chat/${user._id}`}>
                <button className="userlist-chat-button">Chat</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
