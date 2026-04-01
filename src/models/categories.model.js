import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
     
    categoryName : {
        type : String,
        required : true, 
        trim: true,
        unique : true,
        index : true, // Add index for faster search
       },
       description :{
        type : String,
        required : true, 
        trim: true,
        maxlength : 500,
        minlength : 20,
        
    },
      image: {
    url: String,
    publicId: String
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
     slug: {
        type: String,
        unique: true
  },
  isActive: {   
    type: Boolean,
    default: true
  },


   },
   {
    timestamps : true
   }
)
const Category = mongoose.model("Category", categorySchema);
export default Category;