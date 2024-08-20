const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcryptjs') ;
const User = require("../models/user")

const register = async(req,res) =>{
  const {username,email,password} = req.body ;
  try{
    if(!username || !email || !password){
      res.status(401).json({
        message:"something is missing",
        success:false,
      });
    }
    const user = await User.findOne({email});
    if(user){
      return res.status(401).json({
        message:"User already exists",
        success:false,
      })
    }
    const hashedPassword = await bcrypt.hash(password,10) ;
    await User.create({
      username,
      email,
      password: hashedPassword
    })
    return res.status(300).json({
      message:"created",
      success:true
    })
  }catch(error){
    console.log(error)
  }
}

const login = 
module.exports = {register};