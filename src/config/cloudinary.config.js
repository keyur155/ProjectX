import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

const { v2: cloudinaryV2 } = cloudinary;

const apiSecret =
  process.env.CLOUDINARY_API_SECRET || process.env.CLODINARY_API_SECRET;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: apiSecret,
});

export default cloudinaryV2;
