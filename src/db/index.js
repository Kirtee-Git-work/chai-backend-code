import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async ()=>{
  try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   //console.log("connectionInstance",connectionInstance)
   console.log(`\n mongoDB Connect  !! DB Host :
    ${connectionInstance.connection.host}`)  
} catch (error) {
    console.log("Mongoose Connection Error ", error);
    process.exit(1);
  }
}



export default connectDB ;