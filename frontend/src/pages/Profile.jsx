import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [posts, setPosts] = useState([]);
  const [openToWork, setOpenToWork] = useState(false);

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
          setOpenToWork(response.data.user.openToWork || false);
          fetchUserPosts(response.data.user._id);
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

    const fetchUserPosts = async (userId) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/post/userPosts`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          alert('Failed to fetch user posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to fetch user posts');
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

  const handleNewPostChange = (e) => {
    setNewPostCaption(e.target.value);
  };

  const createNewPost = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/post/newPost',
        { caption: newPostCaption },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [response.data.post, ...prevPosts]);
        setNewPostCaption('');
        alert('Post created successfully');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const toggleOpenToWork = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        'http://localhost:5000/api/user/edit',
        { openToWork: !openToWork },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (response.data.success) {
        setIsOpenToWork(!isOpenToWork);
        alert('Open to Work status updated successfully');
      } else {
        alert('Failed to update Open to Work status');
      }
    } catch (error) {
      console.error('Error updating Open to Work status:', error);
      alert('Failed to update Open to Work status');
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
      {/* Open to Work Toggle */}
      <div>
        <label>Open to Work: </label>
        <input
          type="checkbox"
          checked={openToWork}
          onChange={toggleOpenToWork}
        />
      </div>
      <p>Followers: {user.followers.length}</p>
      <ul>
        {user.followers.map((follower) => (
          <li key={follower._id}>
            {follower.username}
            {follower.isOnline && (
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: 'green',
                borderRadius: '50%',
                marginLeft: '8px',
                verticalAlign: 'middle',
              }}></span>
            )}
          </li>
        ))}
      </ul>
      <p>Following: {user.following.length}</p>
      <ul>
        {user.following.map((following) => (
          <li key={following._id}>
            {following.username}
            {following.isOnline && (
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: 'green',
                borderRadius: '50%',
                marginLeft: '8px',
                verticalAlign: 'middle',
              }}></span>
            )}
          </li>
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
            <span>{user.githubUsername}</span>
            <button onClick={() => handleFieldEdit('github', user.githubUsername)}>Edit</button>
          </>
        )}
      </div>

      {/* New Post Creation */}
      <div>
        <textarea
          placeholder="Write a new post..."
          value={newPostCaption}
          onChange={handleNewPostChange}
        />
        <button onClick={createNewPost}>Post</button>
      </div>

      {/* Display User's Posts */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
