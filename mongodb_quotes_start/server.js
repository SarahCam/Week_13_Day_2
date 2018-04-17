const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) {
    console.log(err);
    return;
  }
  const db = client.db("house");

  console.log('Connected to database');

  // CREATE [POST] route...
  server.post('/api/rooms', function(req, res){
    const roomsCollection = db.collection('rooms');
    const roomToSave = req.body;
    roomsCollection.save(roomToSave, function(err, result){
      if (err) {
        console.log(err);
        res.status(500)
        res.send();
      }
      console.log("Room saved as a document to 'rooms' collection in 'house' database");
      res.status(201);
      res.json(result.ops[0]);
    });
  });

  // READ [GET] route...
  server.get('/api/rooms', function(req, res) {
    const roomsCollection = db.collection('rooms');
    roomsCollection.find().toArray(function(err, results){
      if(err) {
        console.log(err);
        res.status(500)
        res.send();
      }
      console.log("Got all documents in 'rooms' collection in 'house' database");
      res.json(results);
    });
  });

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
