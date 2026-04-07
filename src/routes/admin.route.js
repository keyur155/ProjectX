import {Router} from 'express';
import * as Category from '../controllers/category.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';  

const route = Router(); 

route.post('/categories/create-category',verifyJWT, Category.createCategory);
route.post('/categories/update-category',verifyJWT,  Category.updateCategory);
route.post('/categories/delete-category',verifyJWT, Category.deleteCategory);
route.post('/categories/hide-category',verifyJWT, Category.hideCategory);

export default route;   
