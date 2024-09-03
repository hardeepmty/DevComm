import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import fallbackImage from '../images/user.png'; 
import '../styles/UserList.css'

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
    return <div>Loading...</div>;
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div>
      <h1>All Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '80%' }}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user._id} style={{ marginBottom: '20px' }}>
            <Link to={`/profile/${user._id}`}>
              <img
                src={user.profilePicture || fallbackImage} // Use fallback image if profilePicture is not available
                alt={`${user.username}'s profile`}
                width="50"
                height="50"
                style={{ borderRadius: '50%', marginRight: '10px' }}
              />
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
            <button
              onClick={() => handleFollowUnfollow(user._id, user.isFollowing)}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <Link to={`/chat/${user._id}`}>
              <button>Chat</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
