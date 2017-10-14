const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://mongodb:27017/parking';

const getCollection = new Promise((resolve, reject) => {
  MongoClient.connect(mongodbUrl, function(err, db) {
    db.collection('parkingEntries').drop();
    const parkingCollection = db.collection('parkingEntries');

    if (err) {
      reject(err);
      return;
    }

    resolve(parkingCollection);
  });
});

const getRepository = () => getCollection.then((collection) => {
  return {
    addParkingEntry: (parkingData) => new Promise((resolve, reject) => {
      collection.insert(parkingData, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    }),
    getParkingEntries: () => new Promise((resolve, reject) => {
      collection.find().toArray((err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    })
  };
});


module.exports = {
  getRepository: getRepository
};
