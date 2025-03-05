//require('dotenv').config();

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()

.then(() =>{
    app.listen("process.env.PORT || 8000 ");

    console.log(`Server Running on ${process.env.PORT}`)
})
.catch((err) =>{
    console.log("Mongo DB Connection failed !!", err)
})


/* ( async() =>{

    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on(error, () =>{
        console.log("Error", error);
        throw error;
       })

       app.listen(process.env.PORT, () =>{
        console.log(`App Running on ${process.env.PORT}`)
       })
    } catch (error) {  
        console.error("Error", error);
        throw error
    }
})() */

