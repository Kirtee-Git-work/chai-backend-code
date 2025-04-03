import subscriptionController from "../controller/subscription.controller.js";
import Router from "express";
import verifyJWT from "../middleware/auth.middleware.js";

const {
        toggleSubscription,
        getUserChannelSubscribers,
        getSubscribedChannels
      } = subscriptionController

const router = Router(); 

router.route("/c/:channelId").post(verifyJWT,toggleSubscription)
router.route("/c/:channelId/subscribers").get(verifyJWT,getUserChannelSubscribers)
router.route("/c/:subscriberId/subscribedchannels").get(verifyJWT,getSubscribedChannels)
export default router;

