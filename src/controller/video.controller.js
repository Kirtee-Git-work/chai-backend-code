import asyncHandle from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";
import uploadVideoToCloudinary from "../utils/videoUpload.js";
import ApiResponse from "../utils/apiResponse.js";
import Video from "../modules/video.module.js";

const publishVideo = asyncHandle(async (req, res, next) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and Description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video Local path is missing");
    }

    const video = await uploadVideoToCloudinary(videoLocalPath);

  
   const newVideo = await Video.create({
        videoFile: video.secure_url,
        title,
        description,
        owner: req.user._id,
    });

    console.log("newVideo", newVideo);

    return res.status(201).json(new ApiResponse(200, newVideo, "Video Uploaded successfully"));
});

export default {
    publishVideo,
};
