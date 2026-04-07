import Router from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import * as eventController from '../controllers/event.controller.js'

const route = Router();



// host scope
route.post('/create-event', verifyJWT,eventController.createEvent );



export default route;