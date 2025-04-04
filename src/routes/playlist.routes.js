import playlistController from "../controller/playlist.controller.js";
import Router from "express";
import verifyJWT from "../middleware/auth.middleware.js";

const {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} = playlistController

const router = Router(); 

router.route("/createPlaylist").post(verifyJWT,createPlaylist)
router.route("/c/:userId/createPlaylist").get(verifyJWT,getUserPlaylists)
router.route("/c/:playlistId/getPlaylistById").get(verifyJWT,getPlaylistById)
router.route("/c/:playlistId/addvideo/:videoId").put(verifyJWT,addVideoToPlaylist)
router.route("/c/:playlistId/deletevideo/:videoId").delete(verifyJWT,removeVideoFromPlaylist)
router.route("/c/:playlistId/deletePlaylist").delete(verifyJWT,deletePlaylist)
router.route("/c/:playlistId/updatePlaylist").patch(verifyJWT,updatePlaylist)
export default router;