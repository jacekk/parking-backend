const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://mongodb:27017/parking';

const getCollections = new Promise((resolve, reject) => {
  MongoClient.connect(mongodbUrl, function(err, db) {
    const locationCollection = db.collection('parkingLocations');
    const entriesCollection = db.collection('parkingEntries');

    if (err) {
      reject(err);
      return;
    }

    resolve({ locationCollection, entriesCollection });
  });
});

const addCoordinates = (parkings) => {
  return parkings.map((parking) => {
    const newData = Object.assign({}, parking);

    switch(parking.name) {
      case 'Renoma':
          newData.coordinates = {
            lat: 51.1036327,
            long: 17.0293532,
          };
        break;
      case 'Narodowe Forum Muzyki':
        newData.coordinates = {
          lat: 51.1078935,
          long: 17.0241357,
        };
        break;
      case 'Parking Hala Stulecia':
        newData.coordinates = {
          lat: 51.1063,
          long: 17.0776538,
        };
        break;
      case 'ul. Św. Antoniego':
        newData.coordinates = {
          lat: 51.0973204,
          long: 17.0319734,
        };
        break;
      default:
        break;
    }

    return newData;
  });
};

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
    getParkingEntriesByIdAndTime: (id, timeOptions) => new Promise((resolve, reject) => {
        entriesCollection
            .find({ locationId: id, time: timeOptions }, { time: 1, freeSpots: 1, _id: 0 })
            .toArray((err, data) => {
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
                freeSpots: { $first: '$freeSpots' },
                id: { $first: '$locationId' }
            }},
            { $project: { name: "$_id", _id: 0, freeSpots: 1, id: 1 } }
        ])
        .toArray((err, parkings) => {
            if (err) {
                reject(err);
                return;
            }
            
            const parkingsWithCoordinates = addCoordinates(parkings);
            resolve(parkingsWithCoordinates);
        });
    }),
    getLatestEntry: () => new Promise((resolve, reject) => {
        entriesCollection
            .findOne({}, {}, { sort: [['time', 'desc']] }, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
    }),
    findLocationIdByName: (name) => new Promise((resolve, reject) => {
        locationCollection
            .findOne({ name: name }, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
    }),
    getLocations: () => new Promise((resolve, reject) => {
        locationCollection
        .find({})
        .toArray((err, locations) => {
            if (err) {
                reject(err);
                return;
            }
            
            resolve(locations);
        });
    }),
};
});


module.exports = {
  getRepository: getRepository
};
