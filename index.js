const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.post('/jwt', (req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1d'})
            res.send({token})
        })

        app.get('/options', async (req, res) => {
            const query = {}
            const cursor = optionCollection.find(query);
            const options = await cursor.toArray();
            res.send(options);
        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

    }
    finally{

    }
}

Doctor().catch(err => console.error(err));


app.listen(port, ()=>{
    console.log(`Doctor G server is running on port ${port}`)
})