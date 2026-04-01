import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Db_name } from '../constants.js';
const app = express();

// (async ()=>{ 
//     try{
//        await mongoose.connect(`${process.env.MONGO_URI}/${Db_name}` )
//          console.log("Connected to MongoDB");
//     }
//     catch(err){
//         console.error("Error connecting to MongoDB:", err);
//     }
// })


const db_connect =  async () =>{
    try {
       const connection_instace= await  mongoose.connect(`${process.env.MONGO_URI}/${Db_name}`);
       app.on('error', (err) => {
        console.error("Server error:", err);
    });
       console.log("Connected to MongoDB");
        console.log(`MongoDB connected: ${connection_instace.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }
}

export default db_connect;
