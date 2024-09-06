import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import IconButton from '@mui/material/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import '../styles/PostList.css'; // Import the CSS file

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});

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
          const sortedPosts = postsResponse.data.posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
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
        setPosts((prevPosts) => [...posts]);
        alert(`Failed to ${isLiked ? 'unlike' : 'like'} the post`);
      }
    } catch (error) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:`, error);
      alert(`Failed to ${isLiked ? 'unlike' : 'like'} the post`);
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
        const updatedPosts = posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found</div>;
  }

return (
  <div className="profile-posts-list">
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {posts.map((post) => (
        <li key={post._id} className="post">
          <div className="post-header">
            {post.author.profilePicture && (
              <img
                src={post.author.profilePicture}
                alt="Profile"
                className="profile-picture-list"
              />
            )}
            <p className="caption">{post.author.username}</p>
          </div>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="post-image"
            />
          )}
          <p>{post.caption}</p>
          
          {/* Likes Section */}
          <div className="post-actions">
            <IconButton onClick={() => handleLike(post._id)} color="default" className="like-button">
              {post.likes.includes(localStorage.getItem('userId')) ? (
                <Favorite style={{ color: 'red' }} />
              ) : (
                <FavoriteBorder style={{ color: 'black' }} />
              )}
            </IconButton>
            <span className="likes-count">{post.likes.length} likes</span>
          </div>
          
          {/* Comments Preview */}
          <div className="comments-preview">
            {post.comments.length > 0 && (
              <div
                onClick={() => toggleComments(post._id)}
                style={{ cursor: 'pointer', color: '#8e8e8e' }}
              >
                View all {post.comments.length} comments
              </div>
            )}
          </div>

          {/* Full Comments Section (toggled) */}
          {commentsVisible[post._id] && (
            <div className="comments-section">
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {post.comments.map((comment) => (
                  <li key={comment._id} className="comment">
                    {comment.author.profilePicture && (
                      <img
                        src={comment.author.profilePicture}
                        alt="Profile"
                        className="comment-profile-picture"
                      />
                    )}
                    <p>
                      <strong>{comment.author.username}:</strong> {comment.text}
                    </p>
                  </li>
                ))}
              </ul>
              
              {/* Add Comment Input */}
              <form
                onSubmit={(e) => handleCommentSubmit(post._id, e)}
                className="comment-form"
              >
                <input
                  type="text"
                  value={newComment[post._id] || ''}
                  onChange={(e) => handleCommentChange(post._id, e)}
                  placeholder="Add a comment"
                  className="add-comment-input"
                />
                <button type="submit" className="post-comment-button">
                  <SendRoundedIcon />
                </button>
              </form>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>

  );
};

export default PostList;
