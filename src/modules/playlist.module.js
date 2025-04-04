import mongoose , {Schema} from "mongoose";

const playlistSchema = new Schema({

     name:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true 
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
    timestamps:true,
    versionKey:false
}
)


 const Playlist = mongoose.model("Playlist",playlistSchema )

 export default Playlist