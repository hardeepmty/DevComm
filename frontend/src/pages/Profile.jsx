import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import './Profile.css'; // Import the CSS file

const firebaseConfig = {
  apiKey: "AIzaSyDzsU_fwgJNnYb0-B8uMqyl04B3mpWtvRU",
  authDomain: "devcomm-491d0.firebaseapp.com",
  projectId: "devcomm-491d0",
  storageBucket: "devcomm-491d0.appspot.com",
  messagingSenderId: "427598963445",
  appId: "1:427598963445:web:43e3e72377351c859d9bbc",
  measurementId: "G-0NVQ18Y79L"
};

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
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);

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
        setShowNewPostPopup(false);
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

  const handleShowFollowers = () => {
    setShowFollowersPopup(true);
  };

  const handleShowFollowing = () => {
    setShowFollowingPopup(true);
  };

  const handleClosePopup = () => {
    setShowFollowersPopup(false);
    setShowFollowingPopup(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile-container">
      {/* Left Section: Profile Info */}
      <div className="profile-info" style={{backgroundColor:"green"}}>
        {/* Profile Picture */}
        {user.profilePicture && (
          <div className="profile-picture">
            <img
              src={user.profilePicture}
              alt={`${user.username}'s profile`}
              style={{borderRadius:"100%", width:"300px"}}
            />
          </div>
        )}

        <div className="profile-field">
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

        <div className="profile-field">
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

        {/* Bio */}
        <div className="profile-field">
          <label>Bio: </label>
          {editingField === 'bio' ? (
            <>
              <textarea
                value={fieldValue}
                onChange={handleFieldChange}
                required
              />
              <button onClick={() => saveFieldChange('bio')}>Save</button>
              <button onClick={() => setEditingField(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{user.bio}</p>
              <button onClick={() => handleFieldEdit('bio', user.bio)}>Edit</button>
            </>
          )}
        </div>

        <div className="profile-field">
          <label>LinkedIn: </label>
          {editingField === 'linkedin' ? (
            <>
              <input
                type="text"
                value={fieldValue}
                onChange={handleFieldChange}
                required
              />
              <button onClick={() => saveFieldChange('linkedin')}>Save</button>
              <button onClick={() => setEditingField(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span>{user.linkedin}</span>
              <button onClick={() => handleFieldEdit('linkedin', user.linkedin)}>Edit</button>
            </>
          )}
        </div>


        {/* Open to Work */}
        <div className="profile-field">
          <label>Open to Work: </label>
          <button onClick={toggleOpenToWork}>
            {openToWork ? 'Remove Open to Work' : 'Add Open to Work'}
          </button>
        </div>
        <button onClick={() => setShowNewPostPopup(true)}>New Post</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Center Section: User Posts */}
      <div className="profile-posts" style={{backgroundColor:"red"}}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post._id}>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="post-image"
                />
              )}
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>

      {/* Right Section: Buttons and Popup */}
      <div className="profile-buttons" style={{backgroundColor:"pink"}}>
        <button onClick={handleShowFollowers}>Followers {user.followers.length}</button>
        <button onClick={handleShowFollowing}>Following {user.following.length}</button>
      </div>

      {/* New Post Popup */}
      {showNewPostPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Create New Post</h2>
            <textarea
              placeholder="Caption"
              value={newPostCaption}
              onChange={handleNewPostChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button onClick={createNewPost}>Post</button>
            <button onClick={() => setShowNewPostPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Followers Popup */}
      {showFollowersPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Followers</h2>
            {/* Map through user's followers */}
            {user.followers && user.followers.length > 0 ? (
              <ul>
                {user.followers.map((follower) => (
                  <li key={follower._id}>{follower.username}</li>
                ))}
              </ul>
            ) : (
              <p>No followers</p>
            )}
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Following</h2>
            {/* Map through user's following */}
            {user.following && user.following.length > 0 ? (
              <ul>
                {user.following.map((following) => (
                  <li key={following._id}>{following.username}</li>
                ))}
              </ul>
            ) : (
              <p>Not following anyone</p>
            )}
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
