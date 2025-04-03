import asyncHandle from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";
import User from "../modules/user.module.js";
import uploadCloundnery from "../utils/fileUpload.js";
import ApiResponse from "../utils/apiResponse.js";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //console.log("accessToken",accessToken);
    // console.log('refreshToken',refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Token"
    );
  }
};

const registerUser = asyncHandle(async (req, res) => {
  const { UserName, email, fullName, password } = req.body;

  if ([UserName, email, fullName, password].some((val) => val?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ UserName }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  const avtarLocalPath = req.files?.avtar?.[0]?.path;

  console.log("avtarLocalPath", avtarLocalPath)

  const coverdImageLocalPath = req.files?.coverdImage?.[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avtar = await uploadCloundnery(avtarLocalPath);
  const coveredImg = coverdImageLocalPath
    ? await uploadCloundnery(coverdImageLocalPath)
    : null;

  const newUser = await User.create({
    fullName,
    avtar: avtar?.url || "",
    coverdImage: coveredImg?.url || "",
    email,
    password,
    UserName: UserName.toLowerCase(),
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandle(async (req, res) => {
  const { email, UserName, password } = req.body;
  

  if (!email && !UserName) {
    throw new ApiError(400, "Email or Username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ $or: [{ UserName }, { email }] }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //console.log("User found:", user);
  //console.log("Stored Password:", user.password);

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  //console.log("accessTokenInLogin",accessToken)


  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
 // console.log("loggedUser", loggedUser)
  const options = { httpOnly: true, secure: true };

  return (
    res

      .status(200)
      .cookie("accessToken", accessToken, options)
      // .clearCookie("refreshToken")
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      )
  );
});

const logOut = asyncHandle(async (req, res) => {

  await User.findByIdAndUpdate(
    req.user._id,

    { $set: { refreshToken: "" } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandle(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  //console.log("Incoming Refresh Token:", incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(404, "Unauthorized request");
  }

  try {
    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Invalid Refresh Token");
    }
    console.log("Incoming Refresh Token:\n", incomingRefreshToken);
    console.log("Stored Refresh Token in DB:\n", user?.refreshToken);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(404, "Refresh Token expired");
    }

    const options = { httpOnly: true, secure: true };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});


const changeCurrentPasword = asyncHandle(async(req,res,next) =>{
  const  {oldPassword, newPassword,confirmPassword} = req.body

  //console.log("Received:", req.body);

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "Old password, new password, and confirm password are required");
  }
  
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }
  
  const user = await User.findById(req.user?._id).select("+password");

 //const user = await User.findById(req.user?._id)
 console.log("user",user)
 if(!user){
  throw new ApiError(400, "Uer not found")
 }
 
 const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)
 console.log("isPasswordCorrect", isPasswordCorrect)

 if(!isPasswordCorrect){
 throw new ApiError(401, "Password is not correct")
 }

 user.password = newPassword;
 await user.save({validateBeforeSave:false})

 return res
 .status(200)
 .json(new ApiResponse (200, {}, "Password Change Sccussfully"))
})

const getCurrentUser  = asyncHandle(async(req,res,next) =>{
  console.log("req.user",req.user)
  return res
  .status(200)
  .json(new ApiResponse (200,req.user, "Current User Fetched Successfully"))
})


const updateAccountDetails = asyncHandle(async(req,res,next) =>{
    const {fullName,email} = req.body

    if(!fullName || !email){
      throw new ApiError(400, "Fullname and Email is required")
    }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName,
        email  
      }
    },
    {new:true} 
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse (200, user, "Accound Details are Updated Successfully"))
})


const updateUSerAvatar = asyncHandle (async(req,res,next) =>{
   const avtarLocalPath = req.file?.path

   if(!avtarLocalPath){

   }

   const avtar = await uploadCloundnery(avtarLocalPath)

   if(!avtar.url){
    throw new ApiError(400, "Error While Uploading on Avtar")
   }
   
   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avtar:avtar.url 
      }
    },
    {new:true}
    ).select("-passowrd")   //remove password
    
    return res
    .status(200)
    .json(200,user,"Avatar Updated Successfully")
})

const updateUserCoverdImage = asyncHandle (async(req,res,next) =>{
    const coveredImageLocalPath =  req.file?.path
    if(!coveredImageLocalPath){
      throw new ApiError(400,"Covered Image Local Path is Missng")
    }

    const coverdImage = await uploadCloundnery(coveredImageLocalPath)

    if(!coverdImage.url){
      throw new ApiError(400,"Issue While Uploding Covered Image")
    }

    const user = await  User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          coverdImage:coverdImage.url
        }
      },
      {new:true}
      ).select("-password")


      return res
      .status(200)
      .json(200,user,"Covered Image Updated Successfully")
})

const getChannelProfile = asyncHandle(async(req,res,next) =>{
    const {userName} = req.params 
    console.log("req.params", req.params)
    if(!userName?.trim()){
      throw new ApiError(404, "Username not found")
    }

    const channel = await User.aggregate([
      {
      $match:{
        UserName : userName?.toLowerCase( )
      }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"channel",
          as:"subscriber"
        }
      },
      {
        $lookup:{
          from:"subscription",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"
        }
      },
      {
        $addFields: {
          subscribedCount: { $size: "$subscriber" },
          channelSubscribedTOCount: { $size: "$subscribedTo" },
/*           isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscriber.subscriber"] },
              then: true,
              else: false
            }
          } */

          isSubscribed: {
            $in: [req.user?._id, "$subscriber.subscriber"]
        }
        }
      },
      
      {
       $project:{
        fullName:1,
        userName:1,
        subscribedCount:1,
        channelSubscribedTOCount:1,
        isSubscribed:1,
        avtar:1,
        coverdImage:1,
        email:1

       }
      }
  ])

  if(!channel?.length){
    throw  new ApiError (400,"Channel Does not exists")
  }

  return res
  .status(200)
  .json(new ApiResponse (200, channel[0], "User Channel Fetch Sccussfully "))
})

const getWatchHistory = asyncHandle(async(req,res,next) =>{
   const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                 {
                  $project:{
                    fullName:1,
                    username:1,
                    avtar:1
                  }
                 }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
    
        ]
      }
    }
   ])

   return res
   .status(200)
   .json(new ApiResponse (200,user[0].watchHistory,"Watch History fetch sccussflly"))
})

export default {
  registerUser,
  loginUser,
  logOut,
  refreshAccessToken,
  changeCurrentPasword,
  getCurrentUser,
  updateAccountDetails,
  updateUSerAvatar,
  updateUserCoverdImage,
  getChannelProfile,
  getWatchHistory
};
