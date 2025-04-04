import Tweet from "../modules/tweet.module.js"
import asyncHandle from "../utils/asynchandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

const createTweet = asyncHandle(async (req, res) => {

   try {
     const {owner,content} = req.body
     console.log("req.body" ,req.body)
     if(!owner){
         throw new ApiError (400, "Owner is required")
     }
 
     const newTweet= await Tweet.create({
         owner,
         content,
     })
 
    const createdTweet = await Tweet.findById(newTweet._id).select(
     "-password -refreshToken"
    )   
 
    if (!createdTweet) {
     throw new ApiError(500, "Something went wrong while create tweet");
   }
 
   return res
   .status(201)
   .json(new ApiResponse(200, createdTweet, "Tweet create successfully"));
   } catch (error) {
      throw new ApiError (400, "Somehing went wrong while create tweet")
   }
});


const getUserTweets = asyncHandle(async (req, res) => {
 
    try {
        const {tweetId} = req.params
    
        if(!tweetId){
            throw new ApiError(400, "Tweet Id is  Required")
        }
    
       const tweet =  await Tweet.find({owner :tweetId })
       
     return  res
       .status(200)
       .json(new ApiResponse (200, tweet, "Tweet fetched successfully"))
    } catch (error) {
        throw new ApiError (400, "Somehing went wrong while  tweet fetch")
    }
});


const updateTweet = asyncHandle(async (req, res) => {
    //TODO: update tweet

    try {
        const {tweetId} = req.params
    
        if(!tweetId){
            throw new ApiError(400,"Tweet Id is  required")
        }
        const {content} = req.body
      
        if(!content){
            throw new ApiError (400, "Content is Required")
        }
    
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { $set: { content } },
            { new: true }
        );
    
       return res
        .status(200)
        .json(new ApiResponse (200,updatedTweet,"Tweet is updated Sccuessfully"))
    } catch (error) {
        throw new ApiError(400, "Something went wrong while updating tweet ")
    }
})


const deleteTweet = asyncHandle(async (req, res) => {
   try {
     //TODO: delete tweet
     const {tweetId} = req.params
 
     if(!tweetId){
         throw new ApiError (400,"Tweet Id is required")
     }
 
    const tweet = await Tweet.findOneAndDelete(tweetId)
    
   return res
    .status(200)
    .json(new ApiResponse(200, tweet,"Tweet Deleted Successfully"))
   } catch (error) {
     throw new ApiError(400, "Somthing went wrong whil deleting tweet")
   }
})

export default {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}