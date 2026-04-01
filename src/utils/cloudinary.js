import cloudinary  from "../config/cloudinary.config";
import fs from "fs";
import {Readable} from stream

const uploadToCloudinaryDisk = async (localFilePath)=>{
     try {
        if(!localFilePath) return 
        const response = await cloudinary.uploader.upload(
    localFilePath,
           {
            resource_type :"auto",
            folder: "projectX/uploads",
           }
        )
        console.log("succesfully upload",response)
        return response
     } catch (error) {
       

         if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary Upload Error:", error.message);
        return {
                success: false,
                error: error.message,
                };
     }
}
const uploadToCloudinary =async (fileBuffer ,options={})=>{
    return new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: options.folder || "my-app/default",
                public_id: options.public_id, // optional
                transformation: options.transformation || [],
            },
            (error, resolve)=>{
                if(error){
                    console.log("upload error",error)
                    reject(error) 
                }
                
                    resolve({
                        success: true,
                        url: result.secure_url,
                        public_id: result.public_id,
                        });
              
            }
        )
         stream.end(fileBuffer);
    })
}

export default uploadToCloudinary

