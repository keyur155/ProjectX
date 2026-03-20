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

const users = [
    {
        id: 1,
        name: "keyur",
        email: "  gdth "
    },
    {
        id: 2,  
        name: "keyur2",
        email: "  gdth2 "
    },
    {
        id: 3,
        name: "keyur3",
        email: "  gdth3 "
    }
]   


app.get('/api/v1', (req,res) =>{
    res.json(users);
})

app.listen(Port , ()=>{
    console.log(`Server is running on port ${Port}`);
})