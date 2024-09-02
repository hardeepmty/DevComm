const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  imageUrl: { type: String } ,
  createdAt: { type: Date, default: Date.now }, 
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
