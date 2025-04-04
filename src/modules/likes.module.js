
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
        ref:"Tweet"
    }

},
{
    timestamps:true
}
)


  const Likes = Mongoose.model("Likes", likesSchema)

  export default Likes