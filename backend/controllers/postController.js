const Post = require('../models/posts');
const User = require('../models/user'); // Import the User model

// Create a New Post
const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const author = req.user_; // Get the logged-in user's ID from the request object

    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    // Create and save the new post
    const post = new Post({ caption, author });
    await post.save();

    // Update the user's profile with the new post
    await User.findByIdAndUpdate(
      author,
      { $push: { posts: post._id } }, // Add the post ID to the user's posts array
      { new: true } // Return the updated user
    );

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
};

// Get All Posts by the Logged-In User
const getUserPosts = async (req, res) => {
  try {
    const userId = req.user_; // Get the logged-in user's ID from the request object

    // Find the user and populate posts
    const user = await User.findById(userId).populate('posts').exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, posts: user.posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// Get Post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    // Retrieve all posts from the database
    const posts = await Post.find().populate('author', 'username').exec();

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

module.exports = { newPost, getUserPosts, getPostById, getAllPosts };
