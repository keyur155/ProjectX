
import mongoose from "mongoose";
import slugify from "slugify";
const categorySchema = new mongoose.Schema(
    {
     
          categoryName : {
              type : String,
              required : true, 
              trim: true,
              unique : true,
              index : true, // Add index for faster search
            },
            title:{
              type : String,
              required : true, 
              trim: true,
              unique : true,
            },
            description :{
              type : String,
              required : true, 
              trim: true,
              maxlength : 500,
              minlength : 20,
              
          },
          image: {
              url:{
               type:String,
               required :true
            },
            publicId:{
              type:String,
              required:true
            }
  
          },
          
          slug: {
              type: String,
              unique: true,
              index:true
        },
        isActive: {   
          type: Boolean,
          default: true
        },
   },
   {
    timestamps : true
   }
);

categorySchema.pre('save', function(){
  if(!this.slug){
    const combinationString = `${this.categoryName} ${this.title}`
    this.slug = slugify(combinationString,{lower:true,strict:true,trim:true})
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;