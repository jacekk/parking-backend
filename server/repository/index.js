const { MongoClient, ObjectID } = require('mongodb');

// Connection URL
const mongoHost =
    process.env.NODE_ENV === 'production' ? 'localhost' : 'mongodb';
const mongodbUrl = `mongodb://${mongoHost}:27017/parkly`;

const getCollections = async () => {
    const db = await MongoClient.connect(mongodbUrl);

    const locationCollection = db.collection('parkingLocations');
    const entriesCollection = db.collection('parkingEntries');

    return { locationCollection, entriesCollection };
};

const getRepository = async () => {
    const { locationCollection, entriesCollection } = await getCollections();

    return {
        async addParkingLocation(location) {
            return await locationCollection.insert(location);
        },
        async addParkingEntry(parkingData) {
            return await entriesCollection.insert(parkingData);
        },
        async getParkingEntries() {
            return await entriesCollection.find().toArray();
        },
        async getParkingEntriesByIdAndTime(id, timeOptions) {
            return await entriesCollection
                .find(
                    { locationId: new ObjectID(id), time: timeOptions },
                    { time: 1, freeSpots: 1, _id: 0 },
                )
                .sort({ time: 1 })
                .toArray();
        },
        async getParkings() {
            const parkings = await entriesCollection
                .aggregate([
                    { $sort: { time: -1 } },
                    {
                        $group: {
                            _id: '$name',
                            freeSpots: { $first: '$freeSpots' },
                            id: { $first: '$locationId' },
                        },
                    },
                    {
                        $project: {
                            name: '$_id',
                            _id: 0,
                            freeSpots: 1,
                            id: 1,
                        },
                    },
                ])
                .toArray();

            return parkings.map(addCoordinates);
        },
        async getLatestEntry() {
            const [latestEntry] = await entriesCollection
                .find({})
                .sort({ time: -1 })
                .limit(1)
                .toArray();

            return latestEntry;
        },
        async findLocationIdByName(name) {
            return await locationCollection.findOne({ name: name });
        },
        async getLocations() {
            return await locationCollection.find({}).toArray();
        },
    };
};

function addCoordinates(parking) {
    const newData = Object.assign({}, parking);

    switch (parking.name) {
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
        case 'ul. św. Antoniego':
            newData.coordinates = {
                lat: 51.0973204,
                long: 17.0319734,
            };
            break;
        default:
            break;
    }

    return newData;
}

module.exports = {
    getRepository: getRepository,
};
