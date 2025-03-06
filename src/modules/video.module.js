import Mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema =
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


  videoSchema.plugin(mongooseAggregatePaginate)
export const Video = Mongoose.model("Video", videoSchema);
