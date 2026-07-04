import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateAccessAndRefresToken=async (userId) => {
    try {
const user=await User.findById(userId)
const accessToken=user.generateAccessToken()
const refreshToken=user.generateRefreshToken()
user.refreshToken=refreshToken;
await user.save({validateBeforeSave:false})
return{accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"Somethin went wrong while generating access and refresh token");
        
    }
}



const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, timezone } = req.body;

  if (
    [username, email, password, timezone].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields requied");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User already exits");
  }
  const avatarLocalPath = req.file?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    username: username.tolowerCase(),
    email,
    timezone,
    avatar: avatar.url,
    password,
  
  });

const createdUser=await User.findById(user._id).select("-password -refreshtoken")

if (!createdUser) {
    throw new ApiError(500,"Something wen wrong while registering user ")
}

return res.status(200).json(new ApiResponse(200,createdUser,"User created successfully"))

});

const loginUser = asyncHandler(async (req,res) => {
    const {username,email,password}=req.body

    if (!email&&!username) {
        throw new ApiError(400,"Username and Email required");
        
    }

    const user=await User.findone({$or:[{username},{email}]})

    if (!user) {
        throw new ApiError(404,"User not found");
        
    }

    const isValidPassword=await user.isPasswordCorrect(password)
if (!isValidPassword) {
    throw new ApiError(404,"Invalid user credentials");
    
}
const {accessToken,refreshToken}=await generateAccessAndRefresToken(user._id);


const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
const options = {
    httpOnly: true,
    secure: true,
  };


  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully",
      ),
    );

});
