const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://mongodb:27017/parking';

const getCollections = new Promise((resolve, reject) => {
  MongoClient.connect(mongodbUrl, function(err, db) {
    db.collection('parkingLocations').drop();
    db.collection('parkingEntries').drop();

    const locationCollection = db.collection('parkingLocations');
    const entriesCollection = db.collection('parkingEntries');

    if (err) {
      reject(err);
      return;
    }

    resolve({ locationCollection, entriesCollection });
  });
});

const getRepository = () => getCollections.then(({ locationCollection, entriesCollection }) => {
  return {
    addParkingLocation: (location) => new Promise((resolve, reject) => {
      locationCollection.insert(location, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    }),
    addParkingEntry: (parkingData) => new Promise((resolve, reject) => {
      entriesCollection.insert(parkingData, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    }),
    getParkingEntries: () => new Promise((resolve, reject) => {
      entriesCollection.find().toArray((err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    }),
    getParkingEntriesByNameAndTime: (name, timeOptions) => new Promise((resolve, reject) => {
      entriesCollection.find({ name: name, time: timeOptions }).toArray((err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    }),
    getParkings: () => new Promise((resolve, reject) => {
        entriesCollection.aggregate([
            { $sort: { time: -1 } },
            { $group: { 
                _id: '$name', 
                freeSpots: { $first: '$freeSpots' }
            }},
            { $project: { name: "$_id", _id: 0, freeSpots: 1 } }
        ])
        .toArray((err, data) => {
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
