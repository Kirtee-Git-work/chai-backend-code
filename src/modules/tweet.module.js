
import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema
  ({
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey:false });

 const Tweet = mongoose.model("Tweet", tweetSchema);

 export default Tweet
