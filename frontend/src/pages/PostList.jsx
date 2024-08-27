import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({}); // State to manage new comment input

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
    const loggedInUser = localStorage.getItem('userId');
  
    if (!token) {
      window.location.href = '/login';
      return;
    }
  
    try {
      const postIndex = posts.findIndex((post) => post._id === postId);
      const isLiked = posts[postIndex].likes.includes(loggedInUser);
  
      // Optimistically update the UI
      const updatedPosts = [...posts];
      if (isLiked) {
        updatedPosts[postIndex].likes = updatedPosts[postIndex].likes.filter(
          (id) => id !== loggedInUser
        );
      } else {
        updatedPosts[postIndex].likes.push(loggedInUser);
      }
      setPosts(updatedPosts);
  
      let response;
      if (isLiked) {
        response = await axios.post(
          `http://localhost:5000/api/post/unlike/${postId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          `http://localhost:5000/api/post/like/${postId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
  
      if (!response.data.success) {
        // Revert the optimistic update if the request fails
        setPosts((prevPosts) => [...posts]);
        alert(`Failed to ${isLiked ? 'unlike' : 'like'} the post`);
      }
    } catch (error) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:`, error);
      alert(`Failed to ${isLiked ? 'unlike' : 'like'} the post`);
      // Revert the optimistic update in case of error
      setPosts((prevPosts) => [...posts]);
    }
  };

  const handleCommentChange = (postId, event) => {
    setNewComment({ ...newComment, [postId]: event.target.value });
  };

  const handleCommentSubmit = async (postId, event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login';
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/post/comment/${postId}`,
        { text: newComment[postId] },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the comments for the post optimistically
        const updatedPosts = posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        );
        setPosts(updatedPosts);
        setNewComment({ ...newComment, [postId]: '' });
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
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
            <button onClick={() => handleLike(post._id)}>
              {post.likes.includes(localStorage.getItem('userId')) ? 'Unlike' : 'Like'}
            </button>
            <div>
              <h4>Comments</h4>
              <ul>
                {post.comments.map((comment) => (
                  <li key={comment._id}>
                    <p>{comment.text}</p>
                  </li>
                ))}
              </ul>
              <form onSubmit={(e) => handleCommentSubmit(post._id, e)}>
                <input
                  type="text"
                  value={newComment[post._id] || ''}
                  onChange={(e) => handleCommentChange(post._id, e)}
                  placeholder="Add a comment"
                />
                <button type="submit">Comment</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
