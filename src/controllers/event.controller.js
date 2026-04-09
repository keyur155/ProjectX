import Category from "../models/categories.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Event from "../models/event.model.js";
import EventView from "../models/evenView.model.js";
import ApiResponse from "../utils/ApiResponse.js";


// User scope
export const getEvents = asyncHandler(async (req, res)=>{
    const data = req.body;
    const city = "Ahmedabad";
    
    const baseQuery={
        "location.city":city,
        "status":"Published"
    }

    const trendingEvent = await Event.find(baseQuery)
    .select("-description -enableOffineTickets -isActive -rulesandGuidelines -reviews -totalSold -cancellationPolicy -isPublished  ")
    .sort({totalSold :-1})
    .limit(10)

    const upcomingEvents = await Event.find({
         ...baseQuery,
          "eventStartEndDate.startDate" : {$gte : new Date()}}
       )
       .select("-description -enableOffineTickets -isActive -rulesandGuidelines -reviews -totalSold -cancellationPolicy -isPublished  ")
       .sort({"eventStartEndDate.startDate":1})
       .limit(10)

    const latestEvents = await Event.find(baseQuery)
    .select("-description -enableOffineTickets -isActive -rulesandGuidelines -reviews -totalSold -cancellationPolicy -isPublished  ")
    .sort({createdAt:-1})
    .limit(10)
   
    return  res.status(200).json( new ApiResponse(200,"successfully fetched events", {trendingEvent,upcomingEvents,latestEvents}))
   
});

export const getEventsByFilter = asyncHandler(async (req, res)=>{

    const {category,subCategory,city,sortBy,price,date,page=1,limit=10 } = req.query;

    const skip = (page-1)*limit

    let sortOption={}

    const Basequery ={
        status: 'published'
    }
    if(category){
        Basequery.category = category
    }
    if(subCategory){
        Basequery.subCategory = subCategory
    }
    if(city){
        Basequery["location.city"] = city
    }
    if(date){
          const selectedDate = new Date(date);

          Basequery["eventStartEndDate.startDate"] = {
            $gte : new Date( selectedDate.setHours(0,0,0,0)),
            $lte : new Date(selectedDate.setHours(23,59,59,999))
          }
    }
    if(sortBy)
    {
        switch(sortBy) {
            case "latest":
                sortOption = { createdAt:-1 }
                break;
            case "upcoming":
                sortOption ={"eventStartEndDate.startDate": 1}
                break;
            case "trending":
                sortOption= {totalSold:-1,views:-1,likes:-1}
                break;
            case "popular":
                sortOption ={totalSold:-1}
                break;
            default:
                sortOption={ createdAt:-1}
                
        }
    }
       

    const events = await Event.find(Basequery)
                        .select("-description -enableOffineTickets -isActive -rulesandGuidelines -reviews -totalSold -cancellationPolicy -isPublished  ")
                        .sort({createdAt:-1})
                        .skip(skip)
                        .limit(Number(limit))

    const totalCount = await Event.countDocuments(Basequery);

    
    if(events.length === 0){
        return res.status(400).json( new ApiResponse(400,"Not Found any events",events))
    }

    res.status(200).json(
         new ApiResponse(
            200,
            "found events",
            {events :events ,
            totalEvents: totalCount,
            currentPage:Number(page),
            totalPages : Math.ceil(totalCount/Number(limit))

        }
        ));
    
      
});

export const getEventByslug = asyncHandler(async(req,res)=>{
     const {slug} = req.params;
     
     const events  = await Event.findOne({
         slug,
         status:Published
     })
     .populate("category","categoryName")
     .populate("eventhostId","name,email,profilePicture,kycStatus")

       
     trackViewEvent(events,req).catch((error)=>{
        console.log("event tracking update failed",error.message)
     });

     
     if(!events){
        throw new ApiError(404,"Event not found")
     }

     return res.status(200)
     .json(new ApiResponse(200,"Event fetched",events));

     
});

export const getEventsByCategory = asyncHandler(async (req, res)=>{
     const {slug} = req.params;

     const events = await Event.find({"category ": slug})
                    .populate('category', "categoryname")
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



// backGround Work

const trackViewEvent = async(event, req)=>{
   const userId = req.user._id;
   const ip = req.ip;
   const eventId = event._id;

   const existEventView = await EventView.findOne({
    eventId,
    $or:[
        {userId :userId || null},
        {ip },  
    ], 
    viewedAt: {
        $gte: new Date(Date.now() - 10 * 60 * 1000) // 10 min
        }
        
   });

   if(!existEventView){
      await Event.updateOne(
        {_id:eventId},
        {$inc : {views: 1}}
      )

      await EventView.create(
        {
            eventId:eventId,
            userId: userId || null,
            ip:ip
        }
      );
   }


}






