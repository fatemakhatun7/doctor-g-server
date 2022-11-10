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

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}

async function Doctor(){
    try{
        const serviceCollection = client.db('doctorG').collection('services');
        const optionCollection = client.db('doctorG').collection('options');
        const reviewCollection = client.db('doctorG').collection('reviews');

        // jwt
        app.post('/jwt', (req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1d'})
            res.send({token})
        })

        // home page three options
        app.get('/options', async (req, res) => {
            const query = {}
            const cursor = optionCollection.find(query);
            const options = await cursor.toArray();
            res.send(options);
        });

        // all services
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

        // reviews

        app.get('/reviews', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', verifyJWT, async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result);
        });
        
        app.patch('/reviews/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/reviews/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}

Doctor().catch(err => console.error(err));


app.listen(port, ()=>{
    console.log(`Doctor G server is running on port ${port}`)
})