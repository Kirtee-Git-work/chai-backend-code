import mongoose, { Schema } from "mongoose";
import Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    avtar: {
      type: String,
      required: true,
    },
    coverdImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) 
    return next();
 
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.ispasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password)
}


userSchema.method.generateAccessToken = async function(){
   return Jwt.sign({
        _id:this._id,
        email : this.email,
        UserName : this.UserName,
        fullName : this.fullName
    },
    process.env.ACCESS-TOKEN-SECRET,
    {
          expiresIn : process.env.ACCESS-TOKEN-EXPIRE
    }
    )
}

userSchema.method.generateRefreshToken = async function(){
    return Jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH-TOKEN-SECRET,
    {
          expiresIn : process.env.REFRESH-TOKEN-EXPIREY
    }
    )
}
 const User = mongoose.model("User", userSchema);
 export default User
