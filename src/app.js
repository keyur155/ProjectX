import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from the specified client URL
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json({
    limit: '20kb', // Set the maximum request body size to 20kb
}));

app.use(express.urlencoded({ extended: true, limit: '20kb' })); // Set the maximum request body size to 20kb

app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(cookieParser()); // Use cookie-parser middleware to parse cookies

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

//  route import
import authRoute from "./routes/auth.route.js";
import mediaRoute from "./routes/media.route.js";

// admin import
import adminRoute from "./routes/admin.route.js";


// host import
import eventRoute from "./routes/eventRoute.js";
import userRoute from "./routes/user.route.js";

//  router declarations
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/media", mediaRoute);

// host route
app.use("/api/v1/event",eventRoute);


// admin route
app.use("/api/v1/admin",adminRoute);

// Centralized error handler (catches bad JSON too)
app.use((err, req, res, next) => {
    // If a response is already in progress, delegate to Express' default handler
    if (res.headersSent) {
        return next(err);
    }
    // body-parser syntax errors (e.g., malformed JSON)
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error("Invalid JSON payload", err.message);
        return res.status(400).json({
            success: false,
            message: "Invalid JSON payload. Ensure keys are in double quotes and the body is well-formed JSON.",
        });
    }

    // Fallback for any other errors that bubble up
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export { app };
