import Likes from "../modules/likes.module.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandle from "../utils/asynchandler.js"

const toggleVideoLike = asyncHandle(async (req, res) => {
 try {
       const {videoId} = req.params
       //TODO: toggle like on video
       if(!videoId){
           throw ApiError(400, "videoId is required")
       }
      
       const userId = req.user._id; 
   
       const existingLike = await Likes.findOne({
           video:videoId,
           likedby:userId
       })
      
       if(existingLike){
           //unlike
           await Likes.findByIdAndDelete(existingLike._id)
   
          return res
           .status(200)
           .json(new ApiResponse (200, null, "Video Unliked Sccessully"));
       }else{
           //likes
           const newLike = await Likes.create({
               video: videoId,
               likedby: userId
             });
   
          return res
           .status(201)
           .json(new ApiResponse (201, newLike, "Video liked successfully"))
       }
 } catch (error) {
    throw new ApiError (400 ,"Something went wrong while toggle Video Like")
 }
})

//need to test again
const toggleCommentLike = asyncHandle(async (req, res) => {
   try {
     const {commentId} = req.params
    
     if(!commentId){
         throw new ApiError (400, "commentId is required")
     }
    
     const userId = req.user._id; 
 
     const existingLike = await Likes.findOne({
         comment:commentId,
         likedby:userId
     })
 
     if(existingLike){
         //unlike
          await Likes.findByIdAndDelete(existingLike._id)
 
          return res
          .status(200)
          .json(new ApiResponse (200, null, "Comment Unliked Sccessully"));
     }else{
 
         const newLike = await Likes.create({
             comment:commentId,
             likedby:userId
         })
 
         return res
         .status(201)
         .json(new ApiResponse (201, newLike, "Comment liked successfully"))
     }
    
   } catch (error) {
    throw new ApiError (400, "Something went wrong while Like comment ")
   }
})

const toggleTweetLike = asyncHandle(async (req, res) => {
  try {
    const {tweetId} = req.params
   
     if(!tweetId){
      throw new ApiError (400, "tweetId is required")
     }
    const userId = req.user._id; 
    console.log("userId", userId)

    const existingLike =  await Likes.findOne({
      tweet:tweetId,
      likedby:userId
     })
  
     console.log("existingLike", existingLike)
     if(existingLike){
      //unlike
      await Likes.findByIdAndDelete(existingLike._id)
  
      return res
      .status(200)
      .json(new ApiResponse (200, null, "Tweet Unliked Sccessully"));
     }else{
  
      const newLike = await Likes.create({
          tweet:tweetId,
          likedby:userId
      })
  
      return res
      .status(201)
      .json(new ApiResponse (201, newLike, "Tweet liked successfully"))
     }
  } catch (error) {
    throw new ApiError(400, "Something went wrong while toggle Tweet Like")
  }
})

const getLikedVideos = asyncHandle(async (req, res) => {
    //TODO: get all liked videos
   try {
     const {userId} = req.params
     if(!userId){
         throw new ApiError(400, "userId is required")
     }
   
 
     const likes = await Likes.find({
         likedby: userId,
         video: { $ne: null } 
       }).populate("video");
    
 
     return res
     .status(200)
     .json(new ApiResponse (200, likes, "Liked Videos Fetch Successfully"))
   } catch (error) {
    throw new ApiError (400, "Something went wrong while Video Liked Fetch")
   }
})

export default {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}

