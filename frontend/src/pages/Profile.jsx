import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

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
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          alert('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to fetch user profile');
      } finally {
        setLoading(false);
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
      console.error('Error logging out:', error);
      alert('Failed to log out');
    }
  };

  const handleFieldEdit = (fieldName, value) => {
    setEditingField(fieldName);
    setFieldValue(value);
  };

  const handleFieldChange = (e) => {
    setFieldValue(e.target.value);
  };

  const saveFieldChange = async (fieldName) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        'http://localhost:5000/api/user/edit',
        { [fieldName]: fieldValue },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (response.data.success) {
        setUser((prevUser) => ({ ...prevUser, [fieldName]: fieldValue }));
        setEditingField(null);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Profile not found</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Followers: {user.followers.length}</p>
      <ul>
        {user.followers.map((follower) => (
          <li key={follower._id}>{follower.username}</li>
        ))}
      </ul>
      <p>Following: {user.following.length}</p>
      <ul>
        {user.following.map((following) => (
          <li key={following._id}>{following.username}</li>
        ))}
      </ul>
      {/* Profile Picture */}
      {user.profilePicture && (
        <div style={{ marginBottom: '20px' }}>
          <img
            src={user.profilePicture}
            alt={`${user.username}'s profile`}
            style={{ width: '150px', borderRadius: '50%' }}
          />
        </div>
      )}

      <div>
        <label>Username: </label>
        {editingField === 'username' ? (
          <>
            <input
              type="text"
              value={fieldValue}
              onChange={handleFieldChange}
              required
            />
            <button onClick={() => saveFieldChange('username')}>Save</button>
            <button onClick={() => setEditingField(null)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{user.username}</span>
            <button onClick={() => handleFieldEdit('username', user.username)}>Edit</button>
          </>
        )}
      </div>

      <div>
        <label>Email: </label>
        {editingField === 'email' ? (
          <>
            <input
              type="email"
              value={fieldValue}
              onChange={handleFieldChange}
              required
            />
            <button onClick={() => saveFieldChange('email')}>Save</button>
            <button onClick={() => setEditingField(null)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{user.email}</span>
            <button onClick={() => handleFieldEdit('email', user.email)}>Edit</button>
          </>
        )}
      </div>

      <div>
        <label>Bio: </label>
        {editingField === 'bio' ? (
          <>
            <textarea
              value={fieldValue}
              onChange={handleFieldChange}
            />
            <button onClick={() => saveFieldChange('bio')}>Save</button>
            <button onClick={() => setEditingField(null)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{user.bio}</span>
            <button onClick={() => handleFieldEdit('bio', user.bio)}>Edit</button>
          </>
        )}
      </div>

      <div>
        <label>GitHub Username: </label>
        {editingField === 'github' ? (
          <>
            <input
              type="text"
              value={fieldValue}
              onChange={handleFieldChange}
            />
            <button onClick={() => saveFieldChange('github')}>Save</button>
            <button onClick={() => setEditingField(null)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{user.github}</span>
            <button onClick={() => handleFieldEdit('github', user.github)}>Edit</button>
          </>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
