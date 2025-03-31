import ApiError from "../utils/apiError.js";
import asyncHandle from "../utils/asynchandler.js";
import Jwt from "jsonwebtoken";
import User from "../modules/user.module.js";

const verifyJWT = asyncHandle(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

   

    if (!token || typeof token !== "string") {
      throw new ApiError(400, "Unauthorized: Token missing or invalid.");
    }

    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid User Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new ApiError(400, error?.message || "Invalid Token Access");
  }
});

export default verifyJWT;
