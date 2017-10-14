const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://mongodb:27017/parking';

const getCollection = (callback) => {
  MongoClient.connect(mongodbUrl, function(err, db) {
    const parkingCollection = db.collection('parkingEntries');

    if (err) {
      callback(err, null);
      return;
    }

    callback(null, parkingCollection);
  });
};


module.exports = {
  getCollection: getCollection
};
