import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
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
        console.error('Error fetching posts:', error);
        alert('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('userId') ;
    console.log(postId)
    console.log(loggedInUser)

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const likeResponse = await axios.post(
        `http://localhost:5000/api/post/like/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (likeResponse.data.success) {
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: [...post.likes, likeResponse.data.user] } : post
          )
        );
      } else {
        alert('Failed to like the post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like the post');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <p>Author: {post.author.username}</p>
            {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              )}
            <p>{post.caption}</p>
            <p>Likes: {post.likes.length}</p>
            <button onClick={() => handleLike(post._id)}>Like</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
