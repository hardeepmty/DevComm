import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [posts, setPosts] = useState([]); // State to store posts
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch users
        const usersResponse = await axios.get('http://localhost:5000/api/user/getUsers', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (usersResponse.data.success) {
          const usersWithFollowStatus = usersResponse.data.users.map(user => ({
            ...user,
            isFollowing: user.isFollowing !== undefined ? user.isFollowing : false,
          }));

          setUsers(usersWithFollowStatus);
        } else {
          alert('Failed to fetch users');
        }

        // Fetch posts
        const postsResponse = await axios.get('http://localhost:5000/api/post/allPosts', {
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

    fetchUsersAndPosts();
  }, []);

  const handleFollowUnfollow = async (userId, isFollowing) => {
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

  if (users.length === 0 && posts.length === 0) {
    return <div>No users or posts found</div>;
  }

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id} style={{ marginBottom: '20px' }}>
            <Link to={`/profile/${user._id}`}>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={`${user.username}'s profile`}
                  width="50"
                  height="50"
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {user.username}
                {user.openToWork && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'green',
                      display: 'inline-block',
                      marginLeft: '5px',
                    }}
                    title="Open to Work"
                  />
                )}
              </span>
            </Link>
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

      <h1>All Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <p>Author: {post.author.username}</p>
            <p>{post.caption}</p>
            <p>Likes: {post.likes.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
