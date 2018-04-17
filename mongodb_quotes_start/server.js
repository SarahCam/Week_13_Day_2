const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;

// Require a reference to the ObjectID class from mongodb...
const ObjectID = require('mongodb').ObjectID;


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

  // READ ALL [GET] route...
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

  // DELETE ALL [DELETE] route...
  server.delete('/api/rooms', function(req,res) {
    const filterObject = {};
    const roomsCollection = db.collection('rooms');
    roomsCollection.deleteMany(filterObject, function(err, result){
      if(err) {
        res.status(500);
        res.send();
      }
      console.log("Deleted all rooms in 'rooms' collection in 'house' database");
      res.status(204);
      res.send();
    });
  });


// UPDATE [PUT] route...
server.put('/api/rooms/:id', function(req, res){
  const roomsCollection = db.collection('rooms');
  const objectID = ObjectID(req.params.id);
  const filterObject = {_id: objectID};
  const updatedData = req.body;
  roomsCollection.update(filterObject, updatedData, function(err, result){
    if(err) {
      res.status(500);
      res.send();
    }
    console.log("Updated a room  with object ID:" + req.params.id + " in 'rooms' collection in 'house' database");
    res.status(204);
    res.send();
  });

});

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
