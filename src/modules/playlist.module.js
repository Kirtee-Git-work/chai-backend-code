import mongoose , {Schema} from "mongoose";

const playlistSchema = new Schema({

     name:{
        type:String,
        require:true
     },
     description:{
        type:String,
        type:require 
     },
     video:{
        type:mongoose.Types.ObjectId,
        ref:"Video"
     },
     owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
     }
},
{
    timestamps:true
}
)


export const Playlist = mongoose.model("Playlist",playlistSchema )