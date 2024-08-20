import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login'; 
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/getMyself', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        });
        
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          alert('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/logout', {}, { withCredentials: true });
      
      localStorage.removeItem('token');
      
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <img src={user.profilePicture} alt={`${user.username}'s avatar`} />
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <p>Followers: {user.followers.length}</p>
      <p>Following: {user.following.length}</p>
      <p>Posts: {user.posts.length}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
