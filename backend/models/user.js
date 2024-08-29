const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    coins: {type:Number,default:0},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    profilePicture: { type: String, default: '' }, 
    repositories: [
      {
          name: { type: String, required: true },
          url: { type: String, required: true },
          description: { type: String }
      }
  ], 
      openToWork: { type: Boolean, default: false }, // New field for open to work status

},
{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
