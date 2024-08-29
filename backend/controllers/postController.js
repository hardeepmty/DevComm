const Post = require('../models/posts');
const User = require('../models/user'); 
const Comment = require('../models/comments');
const { model } = require('mongoose');

const newPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body; 
    const author = req.user_; 

    if (!caption) {
      return res.status(400).json({ message: 'Caption is required' });
    }

    const post = new Post({ caption, author, imageUrl });
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

    const user = await User.findById(userId)
      .populate({
        path: 'posts',
        populate: [ 
          { path: 'likes', model: 'User' },
          { path: 'comments', model: 'Comment',
            populate: {
              path: 'author',
              model: 'User',
            }
           }
        ]
      })
      .exec();

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
    const posts = await Post.find()
    .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' } 
      })
      .exec();

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

const unlikePost = async (req, res) => {
  try {
    const likedBy = req.user_;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(likedBy)) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    await post.updateOne({ $pull: { likes: likedBy } });
    await post.save();

    res.status(200).json({ success: true, message: 'Post unliked', likes: post.likes });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ success: false, message: 'Failed to unlike post' });
  }
};

const comment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const author = req.user_; 

    if (!text) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({ text, author, post: postId });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

// const deletePost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const post = await Post.findById(postId);

//     if (!post) return res.status(404).json({ message: "Not found" });

//     await post.deleteOne();
//     return res.status(200).json({ message: "Post deleted" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


module.exports = { newPost, getUserPosts, getPostById, getAllPosts, likePost, unlikePost, comment};
