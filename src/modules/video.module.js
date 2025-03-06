import Mongoose, { Schema } from "mongoose";

const videoSchem =
  ({
    videoFile: {
      type: String,
      required: true,
    },
    thumbNail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    descrption: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: 0,
    },
    owner: {
      type: Schema.type.ObjectId,
      ref: "User",
    },
  },
  {
    timestamp: true,
  });

export const Video = Mongoose.model("Video", videoSchem);
