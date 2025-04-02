import multer from "multer";

//Define storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
        console.log("filename", uniqueName);
    }
});

// File filter to allow Image and  video uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4", "video/mkv", "video/avi", "video/mov",  
    "image/jpeg", "image/png", "image/jpg", "image/webp"  
];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only videos are allowed."), false);
    }
};

// Multer configuration
const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export default upload;
