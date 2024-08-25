const Post = require('../models/posts');
const User = require('../models/user'); 

const newPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body; // Add imageUrl
    const author = req.user_; 

    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    const post = new Post({ caption, author, imageUrl }); // Save imageUrl
    await post.save();

    await User.findByIdAndUpdate(
      author,
      { $push: { posts: post._id } }, 
      { new: true } 
    );

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.user_; 

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

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

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

const getAllPosts = async (req, res) => {
  try {
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

const likePost = async(req,res) =>{
  try{
    const likedBy = req.user_ ;
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if(!post) return res.status(404).json({message:"Post not found"}) ;
    await post.updateOne({$addToSet: {likes: likedBy}}) ;
    await post.save() ;
  }catch(error){
    console.log(error)
  }
}

module.exports = { newPost, getUserPosts, getPostById, getAllPosts, likePost};
