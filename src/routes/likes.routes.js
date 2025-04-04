import Router from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import likeController from "../controller/like.controller.js";

const {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} = likeController


const router = Router(); 

router.route("/c/:videoId/toggleVideoLike").patch(verifyJWT,toggleVideoLike)
router.route("/c/:commentId/toggleCommentLike").patch(verifyJWT,toggleCommentLike)
router.route("/c/:tweetId/toggleTweetLike").patch(verifyJWT,toggleTweetLike)
router.route("/c/:userId/LikedVideos").get(verifyJWT,getLikedVideos)

export default router;