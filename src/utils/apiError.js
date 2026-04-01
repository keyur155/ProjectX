class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.errors = errors;
    
        if(stack) {
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }

    }

    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors, stack);
    }
    static unAuthorized(message = "unauthorized",errors=[]){
        return new ApiError(401, message, errors, stack);
    }
    static forbidden(message = "Forbidden", errors = []) {
        return new ApiError(403, message, errors, stack);
    }
    static notFound(message = "Not Found", errors = []) {
        return new ApiError(404, message, errors, stack);
    }
    static internal(message = "Internal Server Error", errors = []) {
        return new ApiError(500, message, errors, stack);
    }
    
}

export default ApiError