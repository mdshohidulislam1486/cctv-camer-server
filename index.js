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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function  run(){
    try{
        await client.connect()
        console.log('conneted to database')
        const database = client.db('cctvCamera')
        const cctvCollection = database.collection('cctv')
        const usersCollcectiion=database.collection('users')
        const orderCollection = database.collection('orders')
        const reviewsCollection = database.collection('reviews')

        // get all cctv collection 
        app.get('/cctv', async(req, res)=>{
            const cursor = cctvCollection.find({});
            const cctv = await cursor.toArray()
            res.send(cctv)
        })

        // POST new orders 
        app.post('/orders', async(req, res)=>{
            const order = req.body
            order.createdAt = new Date();
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // add new cctv collection 
        app.post('/cctv', async (req, res)=>{
            const service = req.body;
            const result = await cctvCollection.insertOne(service)
            res.json(result)
        } )

        // add new review collection 
        app.post('/reviews', async (req, res)=>{
            const service = req.body;
            const result = await reviewsCollection.insertOne(service)
            res.json(result)
            console.log(reslut)
        } )

        // get all orders
        app.get('/orders', async (req, res)=>{
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray()
            res.json(orders)
        })

      

        // delete orders
        app.delete('/orders/:id', async (req , res)=> {
            const id  = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.json(result)

        })

        //  post user data 
        app.post('/users', async (req, res)=>{
            const user = req.body;
            const result = await usersCollcectiion.insertOne(user)
            console.log(result)
            res.json(result);
        })

        app.put('/users', async (req, res)=>{
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

          app.get('/users/:email', async (req, res)=>{
            const email = req.params.email
            const query ={email:email}
            const user = await usersCollcectiion.findOne(query)
            let isAdmin= false;
            if(user?.role ==='admin'){
              isAdmin= true;
            }
            res.json({admin:isAdmin})
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