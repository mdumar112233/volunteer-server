const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

// database connection
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(bodyParser.json());

// data share
app.get('/', (req, res) => {
  res.send('Hello World!')
})





client.connect(err => {
    console.log('error from database', err);
  const eventCollection = client.db("volunteer").collection("events");

  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      console.log(newEvent);
      eventCollection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/events', (req, res) => {
    eventCollection.find({})
    .toArray((err, documents) =>{
      console.log(documents);
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    // const id = ObjectID(req.params.id);
    // console.log('delete item', id);
    // eventCollection.findOneAndDelete({_id: id})
    eventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
});



app.listen(port)