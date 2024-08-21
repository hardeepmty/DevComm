import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/user/getUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        // console.log(response.data)
        if (response.data.success) {
          setUser(response.data.user); 
        } else {
          alert('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      {user.profilePicture && (
        <img
          src={user.profilePicture}
          alt={`${user.username}'s profile`}
          width="100"
          height="100"
        />
      )}
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <p>GitHub: {user.github}</p>
      {/* You can add more user details here */}
    </div>
  );
};

export default UserProfile;
