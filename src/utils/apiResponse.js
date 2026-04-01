class ApiResponse {
    constructor(statusCode, message = "success", data, metadata = {}) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = statusCode < 400;

        if (Object.keys(metadata).length > 0) {
            this.metadata = metadata;
        }
    }

    static Ok(res, data, message = "OK") {
        // Ensure arguments map correctly to the constructor
        return res.status(200).json(new ApiResponse(200, message, data));
    }

    static created(res, data, message = "Resource Created") {
        return res.status(201).json(new ApiResponse(201, message, data));
    }
}

export default ApiResponse;
