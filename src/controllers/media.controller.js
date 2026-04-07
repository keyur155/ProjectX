import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/apiError.js";

export const singleImageUpload = asyncHandler(async(req, res)=>{
     try{
        if(!req.file){
            throw new ApiError(400, "No file uploaded")
        }

        if(!req.file.mimetype.startsWith("image/")){
            throw new ApiError(400, "Invalid file type. Only images are allowed.")
        }

        console.log("Received file", {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        
        const result = await uploadToCloudinary(req.file.buffer, {});

        console.log("Cloudinary upload result", result)

        res.status(200).json(
            new ApiResponse(200,"Image uploaded successfully", { url: result.url }   )
        );


     }
     catch(error){
        throw new ApiError(500, "Image upload failed", error.message)
     }
});


export const bulkImageUpload = asyncHandler(async(req, res)=>{
    const files = req.files;

    if(!files || files.length === 0){
        throw new ApiError(400,"Files are required for bulk upload")
    }

    const results = await Promise.all(files.map(async(file)=>{
        if(!file.mimetype.startsWith("image/")){
            throw new ApiError(400, `Invalid file type for ${file.originalname}. Only images are allowed.`)
        }

        const result = await uploadToCloudinary(file.buffer, {});
        return result;

    }))
    console.log("Cloudinary bulk upload results", results)

    res.status(200).json(
        new ApiResponse(200, "Bulk image upload successful", results.map(r=>({ url: r.url })))
    );


});


export  const singleVideoUpload = asyncHandler(async(req, res)=>{

});

export const bulkVideoUpload = asyncHandler(async(req, res)=>{

});



