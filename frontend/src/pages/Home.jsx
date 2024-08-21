import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage

      if (!token) {
        window.location.href = '/login'; // Redirect to login if no token found
        return;
      }

      try {
        // Fetch users from the server
        const response = await axios.get('http://localhost:5000/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the request header
          withCredentials: true,
        });

        console.log('Fetched Users:', response.data.users); // Log the users for debugging

        if (response.data.success) {
          // Check if `isFollowing` is defined, if not, set a default value
          const usersWithFollowStatus = response.data.users.map(user => ({
            ...user,
            isFollowing: user.isFollowing !== undefined ? user.isFollowing : false,
          }));

          setUsers(usersWithFollowStatus); // Store users in state
        } else {
          alert('Failed to fetch users'); // Show an alert if fetch fails
        }
      } catch (error) {
        console.error('Error fetching users:', error); // Log error if any
        alert('Failed to fetch users'); // Show an alert if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []);

  // Function to handle follow/unfollow
  const handleFollowUnfollow = async (userId, isFollowing) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login';
      return;
    }
  
    try {
      console.log("userId:", userId);  // Debugging the userId
      console.log("isFollowing:", isFollowing);  // Debugging the isFollowing state
  
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
        // Update the users state to reflect the follow/unfollow action
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
