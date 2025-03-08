import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import  fs from "fs"

 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_API
});

const uploadCloundnery = async  (localFilePath) =>{
     try {
        if (!localFilePath) {
            return null
        }
       const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        //console.log("File Uploaded on Cloundnry " , res.url)
        fs.unlinkSync(localFilePath)
        return res
     } catch (error) {
        fs.unlinkSync(localFilePath)  //Removed locally saved file if opretio  failed
        return null 
    }
}


export default uploadCloundnery