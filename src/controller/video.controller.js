import asyncHandle from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";
import uploadVideoToCloudinary from "../utils/videoUpload.js";
import ApiResponse from "../utils/apiResponse.js";
import Video from "../modules/video.module.js";

const publishVideo = asyncHandle(async (req, res, next) => {
    try {
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
    } catch (error) {
      throw ApiError(400,"Something went wrong while video uploaded ")
    }
});

const getAllVideos = asyncHandle(async (req, res) => {
  try {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
  
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
  
    // Search & Filtering
    const filter = {};
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }
    if (userId) {
      filter.owner = userId; // Filter by user
    }
  
    // Sorting configuration
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };
  
    // Fetch videos with pagination & sorting
    const videos = await Video.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
  
    // Total count of videos (for pagination)
    const totalVideos = await Video.countDocuments(filter);
  
    return res.status(200).json(
      new ApiResponse(200, {
        videos,
        totalVideos,
        page: pageNumber,
        totalPages: Math.ceil(totalVideos / pageSize),
      }, "Videos Fetched Successfully")
    );
  } catch (error) {
    throw ApiError(400,"Something went wrong while fetching videos")
  }
});


const getVideoById = asyncHandle(async (req, res) => {
  try {
    const { videoId } = req.params
    
     if(!videoId){
      throw new ApiError (401,"Video Id is Required")
     }
     
     const video = await Video.findById(videoId)
    
     return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    throw ApiError(400,"Something went wrong while video fetching by Id")
  }
})

const updateVideo = asyncHandle(async (req, res) => {
 try {
   const { videoId } = req.params
   
   if(!videoId){
     throw new ApiError (400, "Video Id is Required")
   }
    const { title, description } = req.body;
 
    if(!title && ! description){
     throw new ApiError (400, "Title and Description is required")
    }
    const video = await Video.findByIdAndUpdate(
     videoId,
     {
       $set:{
         title,
         description
       } 
     },{new:true}
     ).select("-password")
 
     return res
     .status(200)
     .json(new ApiResponse (200, video, "Update Video Details Sccussfully"))
 } catch (error) {
  throw ApiError(400,"Something went wrong while update video details")
 }

})


const deleteVideo = asyncHandle(async (req, res) => {
  try {
    const { videoId } = req.params
      if(!videoId){
        throw  new ApiError(400,"Video ID is required")
      }
  
     const video = await Video.findOneAndDelete(
        videoId);
  
    return res
     .status(200)
     .json(new ApiResponse (200, video, "Video Delete Successfully")) 
  } catch (error) {
    throw ApiError(400,"Something went wrong while delete video ")
  }  
})

const togglePublishStatus = asyncHandle(async (req, res) => {
 try {
   const { videoId } = req.params
 
   if(!videoId){
     throw new ApiError(400, "Video Id is Required")
   }
 
    const video = await Video.findById(videoId)
 
    if(!video){
     throw new ApiError(400, "Video is not Found")
    }
 
    video.isPublished = !video.isPublished
    
    await video.save();
 
    return res
    .status(200)
    .json(new ApiResponse (200, video, "Video publish status updated successfully"))
 } catch (error) {
  throw ApiError(400,"Something went wrong while video publish status updated ")
 }
})


export default {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
    
};
