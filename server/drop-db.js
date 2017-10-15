const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://localhost:27017/parkly';

MongoClient.connect(mongodbUrl, function(connectErr, db) {
    if (connectErr) {
        console.error('Migration status: HE DED', connectErr);
        process.exit(1);
    }

    Promise.all([
        db
            .collection('parkingLocations')
            .drop()
            .then(d => console.log('parkingLocations', d)),
        db
            .collection('parkingEntries')
            .drop()
            .then(d => console.log('parkingEntries', d)),
    ])
        .then(() => {
            console.log('Migration status: ITS FINE BOI');
            process.exit(0);
        })
        .catch(promiseErr => {
            console.erro('Migration status: KAPUT', promiseErr);
            process.exit(1);
        });
});
