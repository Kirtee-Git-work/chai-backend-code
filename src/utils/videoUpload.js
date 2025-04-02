import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_API
});

const uploadVideoToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",  // Ensuring only video uploads
            folder: "videos",         // Optional: Store in a specific folder
            chunk_size: 6000000       // Optional: Optimize for large video uploads
        });
        
        fs.unlinkSync(localFilePath); // Remove file after upload
        return res;
    } catch (error) {
        console.error("Cloudinary Video Upload Error:", error);
        fs.unlinkSync(localFilePath); // Cleanup in case of failure
        return null;
    }
};

export default uploadVideoToCloudinary;
