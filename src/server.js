import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
import db_connect from './db/db_connect.js';
import { app } from './app.js';
dotenv.config();

const Port = process.env.PORT


db_connect()
.then(()=>{
    console.log("Connected to MongoDB");
    app.listen(Port ,()=>{
        console.log(`Server is running on port ${Port}`);
    })
   
})
.catch(err=>()=>{
   console.error("Failed to connect to MongoDB:", err);
})

