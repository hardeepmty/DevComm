import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzsU_fwgJNnYb0-B8uMqyl04B3mpWtvRU",
  authDomain: "devcomm-491d0.firebaseapp.com",
  projectId: "devcomm-491d0",
  storageBucket: "devcomm-491d0.appspot.com",
  messagingSenderId: "427598963445",
  appId: "1:427598963445:web:43e3e72377351c859d9bbc",
  measurementId: "G-0NVQ18Y79L"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewPostImage(e.target.files[0]);
    }
  };

  const createNewPost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in');
      return;
    }

    try {
      let imageUrl = '';
      if (newPostImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${newPostImage.name}`);
        await uploadBytes(storageRef, newPostImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const response = await axios.post(
        'http://localhost:5000/api/post/newPost',
        { caption: newPostCaption, imageUrl },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (response.data.success) {
        setPosts((prevPosts) => [response.data.post, ...prevPosts]);
        setNewPostCaption('');
        setNewPostImage(null);
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
        setOpenToWork(!openToWork);
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
              type="text"
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

      {/* New Post Form */}
      <div style={{ marginTop: '20px' }}>
        <h2>Create New Post</h2>
        <textarea
          value={newPostCaption}
          onChange={handleNewPostChange}
          placeholder="What's on your mind?"
          rows="4"
          style={{ width: '100%' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={createNewPost}>Post</button>
      </div>

      {/* Posts */}
      <div style={{ marginTop: '20px' }}>
        <h2>Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
              <p>{post.caption}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              )}
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
