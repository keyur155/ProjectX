import Category from "../models/categories.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Event from "../models/event.model.js";

import ApiResponse from "../utils/ApiResponse.js";


// User scope
export const getEvents = asyncHandler(async (req, res)=>{
      
});

export const getEventById = asyncHandler(async(req,res)=>{

});

export const getEventsByCategory = asyncHandler(async (req, res)=>{

});

export const getEventsByDate = asyncHandler(async (req, res)=>{

});

export const getEventsByLocation = asyncHandler(async (req, res)=>{

});


// host scope

export const createEvent = asyncHandler(async (req, res) => {
    const data = req.body;
    if(req.user.role !== 'admin' && req.user.role !== 'host'){
        throw new ApiError(403,"Not Authorized to Create Event")
    }

    if(["data.eventTitle","data.categoryName","data.description",
        "data.startDate","data.endDate","data.tickets","data.isVirtual",
        "data.eventImages","data.rulesandGuidelines","data.maxCapacity",
        "data.bookingDeadline"
    ].some((field) => data.field?.trim()!=="")){
          throw new ApiError(400,"All Field Required ")
    }
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const todayDate = new Date();
    const bookindDeadline = new Date(date.bookingDeadline);
    const minDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    if(startDate <todayDate ){
        throw new ApiError(400,"start date can not be past")
    }
    else if(startDate > endDate){
        throw new ApiError(400,"event date must be higher then start data")
    }
    else if(startDate.getTime() === endDate.getTime()){
       throw new ApiError(400,"event date and time must not be same ")
    }
    else if(bookindDeadline < minDeadline){
       throw new ApiError(400,"invalide deadline")
    }
    else{

    const categoryMatch = await Category.findOne({categoryName:data.categoryName});

    if(!categoryMatch){
        throw new ApiError(400,"Invalid Category")
    }

    const sameTitle = await Event.findOne({eventTitle:data.eventTitle});

    if(sameTitle){
        throw new ApiError(400, "title already acquired")
    }

    const event = await Event.create({
           ...data,
           eventhostId:req.user._id
    });

    if(!event){
        throw new ApiError("500","something went wrong while creating event")
    }

    return res.status(201)
           .json(new ApiResponse(201,"SucessFully Created Event"))


}



});


export const updateEvent = asyncHandler(async (req, res)=>{

});


export const deleteEvent = asyncHandler(async (req, res)=>{

});

export const getHostEventById = asyncHandler(async (req , res)=>{

});

export const getHostEvents = asyncHandler(async (req, res)=>{

});

export const getPublishedEvents = asyncHandler(async (req, res)=>{      

});

export const getEventAttendees  =asyncHandler(async (req, res)=>{

});


// admin scope



export const adminGetEvents = asyncHandler(async(req, res)=>{

});

export const approvalEvent = asyncHandler(async(req, res)=>{

});






