//import asyncHandle from '../utils/asynchandler'

import ApiError from "../utils/apiError.js";
import User from "../modules/user.module.js"
import uploadCloundnery from "../utils/fileUpload.js"
import ApiResponse from "../utils/apiResponse.js"

const registerUser = async (req, res) => {
    /* res.status(200).json({
        message: "I Love You Babbu"
    }); */

   const {UserName,email,fullName,password} =  req.body
   console.log(UserName,email,fullName,password);
/*       if(UserName === ""){
          throw new ApiError(400,"UserName is required")
      } */

      if ([UserName,email,fullName,password].some((val) =>{
        val?.trim() === ""
      })) {
        throw ApiError(400, "All Fields are required" )
      }

     const exitstingUser = await User.findOne({
        $or:[{UserName},{email}]
     })
     if (exitstingUser) {
        throw new ApiError (409, "Username and emaild is already exit")
     }
     const avtarLocalPath = req.files?.avtar[0]?.path;
     const coverdImageLocalPath = req.files?.coverdImage[0]?.path

     if(!avtarLocalPath){
          throw new ApiError(400, "Avtar File is required")
     }

     const avtar = await uploadCloundnery(avtarLocalPath);
     const coveredImg = await uploadCloundnery(coverdImageLocalPath)
        
     if (!avtar) {
        throw new ApiError(400, "Avtar File is required")
     }
      
     const newUser = await User.create({
        fullName,
        avtar: avtar?.url || "",  
        coverdImage: coveredImg?.url || "", 
        email,
        password,
        UserName: UserName.toLowerCase()
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
     return res.status(201).json(
        new ApiResponse(200,createdUser , "User Register Succefully")
     )

    };   


export default registerUser;
