import {Router} from "express";
import * as mediaController from '../controllers/media.controller.js';
import upload from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const route = Router()

route.post('/upload-image', upload.single('image'), mediaController.singleImageUpload);

route.post('/bulk-upload-images', upload.array('images', 10), mediaController.bulkImageUpload);
export default route;
