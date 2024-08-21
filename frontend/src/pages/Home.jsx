import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log('API response:', response.data); 

        if (response.data.success) {
          console.log('Users data:', response.data.users); 
          setUsers(response.data.users); 
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
            {user.profilePicture && (
              <img
                src={user.profilePicture} 
                alt={`${user.username}'s profile`}
                width="50"
                height="50"
              />
            )}
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Bio: {user.bio}</p>
            <p>GitHub: {user.github}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
