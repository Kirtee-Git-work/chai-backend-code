import Router from "express";
import upload from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import tweetController from "../controller/tweet.controller.js";

const {
         createTweet,
         getUserTweets,
         updateTweet,
         deleteTweet
      } = tweetController

const router = Router();

router.route("/createTweet").post(verifyJWT,createTweet);
router.route("/c/:tweetId/tweet").get(verifyJWT,getUserTweets);
router.route("/c/:tweetId/updateTweet").patch(verifyJWT,updateTweet)
router.route("/c/:tweetId/deleteTweet").delete(verifyJWT,deleteTweet)

export default router;