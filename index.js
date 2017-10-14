console.log('App initiated');

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongoUrl = 'mongodb://mongodb:27017/parking';

// Use connect method to connect to the server
MongoClient.connect(mongoUrl, function(err, db) {
  if (err === null) {
    console.log("Connected successfully to server");
  } else {
    console.log(err);
  }

  db.close();
});
