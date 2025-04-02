import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));



app.use(express.json()); 
app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true, limit:'16mb'}));
app.use(express.static("public"));
app.use(cookieParser())
 



//Routes import
import userRoutes from './routes/user.routes.js'
import videoRoutes from './routes/video.routes.js'
import tweetRoutes from './routes/tweet.routes.js'
/* import commentsRoutes from './routes/comments.routes.js'
import likesRoutes from './routes/likes.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import subscriptionRoutes from './routes/subscription.routes.js'
 */

 

//Routes Declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/tweet", tweetRoutes);
/* app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/likes", likesRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
 */

export default  app ; 



 

