import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyparser.json());
const Port = process.env.PORT


app.get('/', (req,res)=>{
    res.send("hey keyur!, happy learning!")
})

app.listen(Port , ()=>{
    console.log(`Server is running on port ${Port}`);
})