import Router from "express";
import upload from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import videoController from "../controller/video.controller.js";

const { 
       publishVideo,
       getAllVideos,
       getVideoById,
       updateVideo,
       deleteVideo,
       togglePublishStatus
      } = videoController;
const router = Router();

router.route("/uploadvideo").post(
    verifyJWT, 
    upload.fields([{ name: "videoFile", maxCount: 1 }]), 
    publishVideo
);

router.route("/getAllVideos").get(verifyJWT,getAllVideos);
router.route("/c/:videoId").get(verifyJWT,getVideoById);
router.route("/c/:videoId/updateVideo").patch(verifyJWT,updateVideo);
router.route("/c/:videoId/deleteVideo").delete(verifyJWT,deleteVideo)
router.route("/c/:videoId/togglePublishStatus").patch(verifyJWT, togglePublishStatus)

export default router;
