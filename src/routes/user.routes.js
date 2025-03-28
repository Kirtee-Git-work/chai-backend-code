import Router from "express";
import upload from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js"
import userController from "../controller/user.controller.js";
const { registerUser, loginUser, logOut, refreshAccessToken } = userController;

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

router.route("/refresh-Token").post(refreshAccessToken)

export default router;
