import asyncHandle from "../utils/asynchandler.js";
import ApiError from "../utils/apiError.js";
import User from "../modules/user.module.js";
import uploadCloundnery from "../utils/fileUpload.js";
import ApiResponse from "../utils/apiResponse.js";
import Jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //console.log("accessToken",accessToken);
    // console.log('refreshToken',refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Token"
    );
  }
};

const registerUser = asyncHandle(async (req, res) => {
  const { UserName, email, fullName, password } = req.body;

  if ([UserName, email, fullName, password].some((val) => val?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ UserName }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  const avtarLocalPath = req.files?.avtar?.[0]?.path;
  const coverdImageLocalPath = req.files?.coverdImage?.[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avtar = await uploadCloundnery(avtarLocalPath);
  const coveredImg = coverdImageLocalPath
    ? await uploadCloundnery(coverdImageLocalPath)
    : null;

  const newUser = await User.create({
    fullName,
    avtar: avtar?.url || "",
    coverdImage: coveredImg?.url || "",
    email,
    password,
    UserName: UserName.toLowerCase(),
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandle(async (req, res) => {
  const { email, UserName, password } = req.body;

  if (!email && !UserName) {
    throw new ApiError(400, "Email or Username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ $or: [{ UserName }, { email }] }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //console.log("User found:", user);
  //console.log("Stored Password:", user.password);

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  //console.log("accessTokenInLogin",accessToken)
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return (
    res

      .status(200)
      .cookie("accessToken", accessToken, options)
      // .clearCookie("refreshToken")
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      )
  );
});

const logOut = asyncHandle(async (req, res) => {
  //console.log("Received logout req")

  await User.findByIdAndUpdate(
    req.user._id,

    { $set: { refreshToken: "" } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandle(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  //console.log("Incoming Refresh Token:", incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(404, "Unauthorized request");
  }

  try {
    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Invalid Refresh Token");
    }
    console.log("Incoming Refresh Token:\n", incomingRefreshToken);
    console.log("Stored Refresh Token in DB:\n", user?.refreshToken);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(404, "Refresh Token expired");
    }

    const options = { httpOnly: true, secure: true };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

export default {
  registerUser,
  loginUser,
  logOut,
  refreshAccessToken,
};
