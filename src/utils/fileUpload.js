import { v2 } from "cloudinary";
import exp from "constants";
import  fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDNERY-API-NAME, 
    api_key: process.env.CLOUDNERY-API-KEY, 
    api_secret: process.env.CLOUDNERY-SECRET-API
});

const uploadCloundnery = async  (localFilePath) =>{
     try {
        if (!localFilePath) {
            return null
        }
       const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        console.log("File Uploaded on Cloundnry " , res.url)
        return res
     } catch (error) {
        fs.unlinkSync(localFilePath)  //Removed locally saved file if opretio  failed
        return null 
    }
}


export {uploadCloundnery}