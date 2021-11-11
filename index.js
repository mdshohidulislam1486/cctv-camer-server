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
        const usersCollcectiion=database.collection('users')

        // post api

        app.post('/cctv', async (req, res)=>{
            const cctv = {
                "name":'Eighteen Century'

            }
            const result = await cctvCollection.insertOne(cctv)
            console.log(result)
        })

        app.get('/users/:email', async (req, res)=>{
            const email = req.params.email
            const query ={email:email}
            const user = await usersCollcectiion.findOne(query)
            let isAdmin= false;
            if(user.role ==='admin'){
              isAdmin= true;
            }
            res.json({admin:isAdmin})
          })

           //  post user data 
        app.post('/users', async (req, res)=>{
            const user = req.body;
            const result = await usersCollcectiion.insertOne(user)
            console.log(result)
            res.json(result);
        })

     /*    app.put('/users', async (req, res)=>{
            const user = req.body;
            const filter = {email: user.email}
            const options ={upsert:true}
            const updateDoc = {$set: user}
            const result = await usersCollcectiion.updateOne(filter, updateDoc, options)
            res.json(result)
          })

          app.put('/users/admin', async (req, res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set:{role:'admin'}}
            const result = await usersCollcectiion.updateOne(filter, updateDoc)
            res.json(result)
          })
       */

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