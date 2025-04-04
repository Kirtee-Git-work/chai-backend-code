import  Playlist  from "../modules/playlist.module.js";
import  ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandle from "../utils/asynchandler.js"

const createPlaylist = asyncHandle(async (req, res) => {
   try {
     const {name, description} = req.body
     
     if(!name || !description){
         throw new ApiError (400, "Name and Description is required")
     }
 
     const newPlayList  = await Playlist.create({
         name,
         description,
         owner: req.user._id
     })
 
     const createdPlayList = await Playlist.findById(newPlayList._id).select(
         "-password -refreshToken"
       );
 
     if(!createdPlayList){
         throw new ApiError(400, "Something went wrong while creating play list")
     } 
 
     res 
     .status(200)
     .json(new ApiResponse (200 ,createdPlayList, "Paylist Created Successfully"))
   } catch (error) {
       throw new ApiError("Something went wrong while creating playlist")
   }
})

const getUserPlaylists = asyncHandle(async (req, res) => {
   try {
     const {userId} = req.params
    
     if(!userId){
         throw new ApiError (400, "User Id is required")
     }
 
    const playlists =  await Playlist.find({owner:userId})
    //.populate("owner", "fullName userName avatar email") 
    //.populate("video", "title thumbnailUrl duration") 
    .select("-password -refreshToken"); 
 
    res
    .status(200)
    .json(new ApiResponse (200,playlists, "User Playlist Fetch Successfully"))
   } catch (error) {
     throw new ApiError(400, "Something went wrong while fetching user playlist ")
   }
})


const getPlaylistById = asyncHandle(async (req, res) => {
  try {
    const {playlistId} = req.params
   
     if(!playlistId){
      throw new ApiError(400,"playlistId is required")
     }
  
     const playlist = await Playlist.findById(playlistId);
  
     res
     .status(200)
     .json(new ApiResponse (200,playlist, "Playlist Fetch by Id Successfully"))
  } catch (error) {
     throw ApiError(400, "Something went wrong while Fetching Playlist By Id  ")
  }
})

const addVideoToPlaylist = asyncHandle(async (req, res) => {
  try {
    const {playlistId, videoId} = req.params
    
   
    if(!playlistId && !videoId){
       throw new ApiError(400, "playlistId, videoId is required")
    }
  
    const  playlist = await Playlist.findById(playlistId)
    
    if(!playlist){
      throw new ApiError(400,"Playlist Id not Found")
    }
  
    if(playlist.video && playlist.video.toString() === videoId){
        throw new ApiError ("Video already exists in playlist")
    }
     //Add video
     playlist.video =videoId
  
    await playlist.save()
  
    const updatedPlaylist = await Playlist.findById(playlistId).populate("video");
  
    res
    .status(200)
    .json(new ApiResponse (200, updatedPlaylist, "Video Added Sccessfully in Playlist" ))
  } catch (error) {
     throw ApiError(400, "Something went wrrong while Add Video to playlist")
  }

})

const removeVideoFromPlaylist = asyncHandle(async (req, res) => {
 try {
   const {playlistId, videoId} = req.params
  
   if(!playlistId && !videoId){
     throw new ApiError(400, "playlistId, videoId is required")
   }
 
   const playlist = await Playlist.findByIdAndUpdate(playlistId)
 
   if (!playlist.video || playlist.video.toString() !== videoId) {
     throw new ApiError(400, "Video not found in playlist");
   }
 
   playlist.video =undefined
 
   await playlist.save()
 
   const updatedPlaylist = await Playlist.findById(playlistId);
 
   return res.status(200).json(
     new ApiResponse(200, updatedPlaylist, "Video removed successfully from playlist")
   );
 } catch (error) {
    throw new ApiError(400, "Something went wrong while remove video from playlist")
 }
})

const deletePlaylist = asyncHandle(async (req, res) => {
 try {
   const {playlistId} = req.params
   
   if(!playlistId){
     throw ApiError(400,"playlistId is reuired")
   }
 
  const playlist = await Playlist.findByIdAndDelete(playlistId)
 
  if(!playlist){
   throw new ApiError(400, "Playlist Not Found")
  }
 
  res
  .status(200)
  .json(new ApiResponse (200,playlist, "Playlist Deleted Succefully"))
 } catch (error) {
    throw ApiError(400, "Something went wrong while deleting playlist")
 }
})


const updatePlaylist = asyncHandle(async (req, res) => {
  try {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if(!playlistId){
      throw ApiError(400, "playlistId is required")
    }
  
    const playlist =  await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set:{
          name,
          description
        }
      },{
        new:true
      }
      ).select("-password -refreshToken")
  
      if(!playlist){
        throw ApiError(400, "playlist is not found")
      }
      res
      .status(200)
      .json(new ApiResponse (200,playlist ,"Playlist Updated Successfully" ))
  } catch (error) {
    throw new ApiError("Something went wrong while updating playlist")
  }
})


export default {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}