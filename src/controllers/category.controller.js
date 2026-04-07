import { asyncHandler } from "../utils/asyncHandler.js";
import Category from "../models/categories.model.js";  
import ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js"; 
 



export const createCategory = asyncHandler(async(req, res)=>{
    
    if(req.user.role !=="admin"){
        throw new ApiError(403, "Forbidden: Admins only")
     }  
     
     const data= req.body;
     console.log("Received category data", data);
     if(["categoryName","title","description","image_url","publicId"].some((field) => field?.trim() === "" || !(field in data))){
        throw new ApiError(400, "All fields are required and cannot be empty")
     }

    
     const category = await Category.create({
        categoryName: data.categoryName,
        title: data.title,
        description: data.description,
        image : {
            url: data.image_url ,
            publicId: data.publicId
        },

     });

    if(!category){
        throw new ApiError(500,"failed to create category");
    }

    res.status(201)
    .json(new ApiResponse(201, "Category created successfully"))

});

export const updateCategory = asyncHandler(async(req, res)=>{   

});

export const deleteCategory = asyncHandler(async(req, res)=>{

});

export const hideCategory = asyncHandler(async(req, res)=>{

});