import ApiError  from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandle from "../utils/asynchandler.js"
import Subscription from "../modules/subscription.module.js"


const toggleSubscription = asyncHandle(async (req, res) => {
    try {
        const {channelId} = req.params
    
        if(!channelId){
            throw new ApiError (400, "Channel Id is  Required")
        }
         
        const userId = req.user._id;
        
        console.log("userId", userId)
    
    
        // Check if subscription exists
        const existingSubscription = await Subscription.findOne({
            subscriber: userId,
            channel: channelId
        });
       
        console.log("existingSubscription",existingSubscription)
        if (existingSubscription) {
            // Unsubscribe (delete the subscription record)
            await Subscription.findByIdAndDelete(existingSubscription._id);
    
            return res.status(200).json(new ApiResponse(
                200,
                null,
                "Unsubscribed successfully"
            ));
        } else {
            // Subscribe (create a new subscription)
            const newSubscription = await Subscription.create({
                subscriber: userId,
                channel: channelId
            });
    
            return res.status(201).json(new ApiResponse(
                201,
                newSubscription,
                "Subscribed successfully"
            ));
        }
    } catch (error) {
        throw new ApiError(400, "Something went wrong while Toggle Subscription")
    }
});


const getUserChannelSubscribers = asyncHandle(async (req, res) => {
   try {
     const {channelId} = req.params
     if(!channelId){
         throw new ApiError(400,"Channel Id is Required")
     }
 
   const subscribers = await  Subscription.find({channel:channelId})
   .populate("subscriber", "fullName userName avatar email") 
   .select("subscriber");
 
    console.log("subscribers", subscribers)
 
    if (!subscribers.length) {
     return res.status(200).json(new ApiResponse(200, [], "No subscribers found for this channel"));
 }
 
   return res.status(200).json(
     new ApiResponse(200, subscribers, "Subscribers fetched successfully")
 );
   } catch (error) {
    throw ApiError(400,"Something went wrong while  Subscribed fetched successfully")
   }
})


// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandle(async (req, res) => {
    
   try {
     const { subscriberId } = req.params
 
     if(!subscriberId){
         throw new ApiError(400,"subscriberId is required");
     }
 
     const subscriptions = await Subscription.find({ subscriber: subscriberId })
         .populate("channel", "fullName userName avatar email") 
         .select("channel");
 
     if (!subscriptions.length) {
         return res.status(200).json(new ApiResponse(200, [], "No subscribed channels found for this user"));
     }
 
     return res.status(200).json(
         new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully")
     );
   } catch (error) {
    throw new ApiError(400, "something went wrong while get Subscribed Channels list")
   }
}) 

export default {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}