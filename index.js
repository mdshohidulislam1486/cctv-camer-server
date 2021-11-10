const express = require('express');
require('dotenv').config()
const { json } = require('express');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pp3lw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function  run(){
    try{
        await client.connect()
        console.log('conneted to database')
        const database = client.db('cctvCamera')
        const cctvCollection = database.collection('cctv')

        // post api

        app.post('/cctv', async (req, res)=>{
            const cctv = {
                "name":'Eighteen Century'

            }
            const result = await cctvCollection.insertOne(cctv)
            console.log(result)
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('Running my curd server')
})

app.listen(port, ()=>{
console.log('Running my curd operation server')
})