import Router from "express";
import upload from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import userController from "../controller/user.controller.js";
const { registerUser, loginUser, logOut, refreshAccessToken,changeCurrentPasword ,
  getCurrentUser,updateAccountDetails,
  updateUSerAvatar,
  updateUserCoverdImage,
  getChannelProfile,
  getWatchHistory
} = userController;

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avtar",
      maxCount: 1,
    },
    {
      name: "coverdImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// Secure logout route
router.route("/logout").post(verifyJWT, logOut);

router.route("/refresh-Token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT,changeCurrentPasword);

router.route("/current-user").get(verifyJWT,getCurrentUser);

router.route("/update-Account").patch(verifyJWT,updateAccountDetails);

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUSerAvatar)

router.route("/coverd-Image").patch(verifyJWT,upload.single("coverImage"), updateUserCoverdImage)

//coz using params
router.route("/c/:getChannelProfile").get(verifyJWT,getChannelProfile)


router.route("/watch-history").get(verifyJWT,  getWatchHistory)

export default router;
