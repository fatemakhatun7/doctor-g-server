const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require ('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send("Doctor G server is running on port 5000");
})

app.listen(port, ()=>{
    console.log(`Doctor G server is running on port ${port}`)
})