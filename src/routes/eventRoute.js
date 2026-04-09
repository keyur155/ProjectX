import Router from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import * as eventController from '../controllers/event.controller.js'

const route = Router();

// user Scope
route.get("/event", eventController.getEvents);
route.get("/event/:slug",eventController.getEventByslug);


// host scope
route.post('/create-event', verifyJWT,eventController.createEvent );



export default route;