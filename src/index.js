//require('dotenv').config();

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path:'./.env'
})
const PORT = process.env.PORT || 8010;

connectDB()

.then(() =>{
    app.listen(PORT);

    console.log(`Server Running on 8010`)
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

