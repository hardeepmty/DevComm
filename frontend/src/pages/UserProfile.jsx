import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        // Fetch the specific user's details
        const userResponse = await axios.get(`http://localhost:5000/api/user/getUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // Fetch all users for follow/unfollow functionality
        const usersResponse = await axios.get('http://localhost:5000/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (userResponse.data.success && usersResponse.data.success) {
          setUser(userResponse.data.user);

          // Add follow status to each user
          const usersWithFollowStatus = usersResponse.data.users.map((usr) => ({
            ...usr,
            isFollowing: usr.isFollowing !== undefined ? usr.isFollowing : false,
          }));

          setAllUsers(usersWithFollowStatus);
        } else {
          alert('Failed to fetch user or users');
        }

        // Fetch posts of the specific user
        const postsResponse = await axios.get(`http://localhost:5000/api/post/user/${userId}/posts`, {
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
        alert('Failed to fetch posts');
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
        ? 'http://localhost:5000/api/user/unfollow'
        : 'http://localhost:5000/api/user/follow';

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

      <h2>Followers ({user.followers.length})</h2>
      <ul>
        {user.followers.map((follower) => (
          <li key={follower._id}>
            <div onClick={() => handleUserClick(follower._id)} style={{ cursor: 'pointer' }}>
              {follower.profilePicture && (
                <img
                  src={follower.profilePicture}
                  alt={`${follower.username}'s profile`}
                  width="50"
                  height="50"
                />
              )}
              <p>{follower.username}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUnfollow(follower._id, follower.isFollowing);
              }}
            >
              {follower.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>

      <h2>Following ({user.following.length})</h2>
      <ul>
        {user.following.map((following) => (
          <li key={following._id}>
            <div onClick={() => handleUserClick(following._id)} style={{ cursor: 'pointer' }}>
              {following.profilePicture && (
                <img
                  src={following.profilePicture}
                  alt={`${following.username}'s profile`}
                  width="50"
                  height="50"
                />
              )}
              <p>{following.username}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                handleFollowUnfollow(following._id, following.isFollowing);
              }}
            >
              {following.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>

      <h2>Posts</h2>
      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <div key={post._id}>
              {post.imageUrl && <img src={post.imageUrl} alt="Post image" width="100" />}
              <p>{post.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts to display</p>
      )}
    </div>
  );
};

export default UserProfile;
