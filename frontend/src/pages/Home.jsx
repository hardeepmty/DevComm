import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          const usersWithFollowStatus = response.data.users.map(user => ({
            ...user,
            isFollowing: user.isFollowing !== undefined ? user.isFollowing : false,
          }));

          setUsers(usersWithFollowStatus);
        } else {
          alert('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <Link to={`/profile/${user._id}`}>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={`${user.username}'s profile`}
                  width="50"
                  height="50"
                />
              )}
              <p>Username: {user.username}</p>
            </Link>
            <p>Email: {user.email}</p>
            <p>Bio: {user.bio}</p>
            <p>GitHub: {user.github}</p>
            <button
              onClick={() => handleFollowUnfollow(user._id, user.isFollowing)}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
