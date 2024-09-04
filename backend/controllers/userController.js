const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const Post = require("../models/posts");
const axios = require('axios')

const register = async (req, res) => {
  const { username, email, password, github } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    let profilePicture = '';
    let repositories = [];

    if (github) {
      try {
        const githubResponse = await axios.get(`https://api.github.com/users/${github}`);
        profilePicture = githubResponse.data.avatar_url;

        const reposResponse = await axios.get(`https://api.github.com/users/${github}/repos`);
        repositories = reposResponse.data.map(repo => ({
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
        }));
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error.message);
        profilePicture = ''; 
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      github,
      profilePicture,
      repositories, 
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "No user found",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    // const populatedPosts = await Promise.all(
    //   user.posts.map(async (postId) => {
    //     const post = await Post.findById(postId);
    //     if (post.author.equals(user._id)) {
    //       return post;
    //     }
    //     return null;
    //   })
    // );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      coins:user.coins,
      // posts: populatedPosts,
      repositories: user.repositories,
    };

    return res.cookie('token', token, { sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const logout = async (_, res) => {
  try {
    return res.cookie('token', "", { maxAge: 0 }).json({
      message: 'Logged out successfully.',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getMyself = async (req, res) => {
  try {
    const user = await User.findById(req.user_)
      .populate('followers', 'username') // Populate followers with their usernames
      .populate('following', 'username') // Populate following with their usernames
      .select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const editProfile = async (req, res) => {
  const userId = req.user_;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const { username, email, bio, github, openToWork } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (typeof openToWork === 'boolean') user.openToWork = openToWork;

    if (github && github !== user.github) {
      try {
        const githubResponse = await axios.get(`https://api.github.com/users/${github}`);
        user.profilePicture = githubResponse.data.avatar_url;

        const reposResponse = await axios.get(`https://api.github.com/users/${github}/repos`);
        user.repositories = reposResponse.data.map(repo => ({
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
        }));
        user.github = github;
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error.message);
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        github: user.github,
        repositories: user.repositories,
        openToWork: user.openToWork, // Include openToWork in the response
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user_;
    const users = await User.find({}).select('-password'); 

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
        success: false,
      });
    }

    const usersWithFollowStatus = users.map(user => ({
      ...user.toObject(),
      isFollowing: user.followers.includes(currentUserId),
    }));

    return res.status(200).json({
      message: "All user profiles retrieved successfully",
      success: true,
      users: usersWithFollowStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params; 

  try {
    const user = await User.findById(id)
      .populate('followers', 'username') 
      .populate('following', 'username') 
      .select('-password'); 

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};







//Implementing follow and unfollow

const followUser = async (req, res) => {
  try {
    const currentUserId = req.user_;
    const { userIdToFollow } = req.body;

    if (!userIdToFollow) {
      return res.status(400).json({
        message: "No user ID provided",
        success: false,
      });
    }

    if(currentUserId===userIdToFollow){
      return res.status(400).json({
        message: "Cannot follow urself",
        success: false,
      });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({
        message: "User to follow not found",
        success: false,
      });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: userIdToFollow },
    });

    await User.findByIdAndUpdate(userIdToFollow, {
      $addToSet: { followers: currentUserId },
    });

    const updatedUser = await User.findById(currentUserId).select('following');
    return res.status(200).json({
      message: "User followed successfully",
      success: true,
      following: updatedUser.following,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user_;
    const { userIdToUnfollow } = req.body;

    if (!userIdToUnfollow) {
      return res.status(400).json({
        message: "No user ID provided",
        success: false,
      });
    }

    const userToUnfollow = await User.findById(userIdToUnfollow);
    if (!userToUnfollow) {
      return res.status(404).json({
        message: "User to unfollow not found",
        success: false,
      });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser.following.includes(userIdToUnfollow)) {
      return res.status(400).json({
        message: "You are not following this user",
        success: false,
      });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userIdToUnfollow },
    });

    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId },
    });

    const updatedUser = await User.findById(currentUserId).select('following');
    return res.status(200).json({
      message: "User unfollowed successfully",
      success: true,
      following: updatedUser.following,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};




module.exports = { register, login, logout, getMyself, editProfile, getUsers, followUser, unfollowUser, getUserProfile };
