// this method is used to handle async errors in express routes method 1
import donenv from 'dotenv';    
donenv.config();
// try catch block async handler
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // Avoid double-send if a response was already started
        if (res.headersSent) {
            return;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            stack: process.env.NODE_ENV === 'DEVELOPMENT' ? error.stack : undefined,
        });
    }
};

// method 2 with promise
const asyncHandler2 = (requestHandler) =>{
    return (req, res, next).promise.then(() => {
        Promise.resolve(requestHandler(req, res, next));
    }).catch((error)=>next(error));
}   

export { asyncHandler, asyncHandler2 };
