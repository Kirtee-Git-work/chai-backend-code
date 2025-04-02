
import Mongoose, {Schema} from "mongoose";

const likesSchema = new Schema ({
    
    comment:{
        type:Schema.Types.ObjectId,
        ref:"comments"
    },
    video:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },
    likedby:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:Tweet
    }

},
{
    timestamps:true
}
)


export  const Likes = Mongoose.model("Likes", likesSchema)