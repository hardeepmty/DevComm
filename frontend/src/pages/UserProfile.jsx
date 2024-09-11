import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserProfile.css'; 

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const userResponse = await axios.get(`https://devcomm.onrender.com/api/user/getUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const usersResponse = await axios.get('https://devcomm.onrender.com/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (userResponse.data.success && usersResponse.data.success) {
          setUser(userResponse.data.user);

          const usersWithFollowStatus = usersResponse.data.users.map((usr) => ({
            ...usr,
            isFollowing: usr.isFollowing !== undefined ? usr.isFollowing : false,
          }));

          setAllUsers(usersWithFollowStatus);
        } else {
          alert('Failed to fetch user or users');
        }

        const postsResponse = await axios.get(`https://devcomm.onrender.com/api/post/user/${userId}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (postsResponse.data.success) {
          setPosts(postsResponse.data.posts);
        } else {
          alert('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFollowUnfollow = async (targetUserId, isFollowing) => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const endpoint = isFollowing
        ? 'https://devcomm.onrender.com/api/user/unfollow'
        : 'https://devcomm.onrender.com/api/user/follow';

      const payload = isFollowing
        ? { userIdToUnfollow: targetUserId }
        : { userIdToFollow: targetUserId };

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        setUser((prevUser) =>
          ({
            ...prevUser,
            followers: prevUser.followers.map((follower) =>
              follower._id === targetUserId ? { ...follower, isFollowing: !isFollowing } : follower
            ),
            following: prevUser.following.map((following) =>
              following._id === targetUserId ? { ...following, isFollowing: !isFollowing } : following
            ),
          })
        );

        setAllUsers((prevUsers) =>
          prevUsers.map((usr) =>
            usr._id === targetUserId ? { ...usr, isFollowing: !isFollowing } : usr
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

  const handleUserClick = (id) => {
    navigate(`/profile/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt={`${user.username}'s profile`}
            className="profile-picture"
          />
        )}
        <div className="user-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>LinkedIn:</strong> {user.linkedin}</p>
        </div>
      </div>
      <div className="profile-center">
        {posts.length > 0 ? (
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post._id} className="post-user-profile">
                {post.imageUrl && <img src={post.imageUrl} alt="Post image" className="post-image" />}
                <p>{post.caption}</p>
                <p>Likes: {post.likes.length}</p>
                <p>Comments: {post.comments.length}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts to display</p>
        )}
      </div>
      <div className="profile-right">
        <div className="profile-follow">
          <button>Followers {user.followers.length}</button>
          <button>Following {user.following.length}</button>
        </div>
        <p>Coins: {user.coins}</p>
        <h2>Repositories</h2>
        {user.repositories && user.repositories.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {user.repositories.slice(0, 5).map((repository) => (
              <li key={repository._id} style={{ marginBottom: '10px' }}>
                <div
                  className='repo-box'
                  
                >
                  {repository.name}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Repos</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
