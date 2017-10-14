const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://mongodb:27017/parking';

const getConnection = (callback) => {
  MongoClient.connect(mongodbUrl, function(err, db) {
    callback(err, db);
  });
};


module.exports = {
  getConnection: getConnection
};
