const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require ('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send("Doctor G server is running on port 5000");
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fxdma7b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function Doctor(){
    try{
        const serviceCollection = client.db('doctorG').collection('services');
        const optionCollection = client.db('doctorG').collection('options');
    }
    finally{

    }
}


app.listen(port, ()=>{
    console.log(`Doctor G server is running on port ${port}`)
})