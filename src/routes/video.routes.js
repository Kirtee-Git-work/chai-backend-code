import Router from "express";
import upload from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import videoController from "../controller/video.controller.js";

const { publishVideo } = videoController;
const router = Router();

router.route("/uploadvideo").post(
    verifyJWT, 
    upload.fields([{ name: "videoFile", maxCount: 1 }]), 
    publishVideo
);

export default router;
