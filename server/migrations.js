const MongoClient = require('mongodb').MongoClient;

// Connection URL
const mongodbUrl = 'mongodb://localhost:27017/parking';

MongoClient.connect(mongodbUrl, function(err, db) {
    if (err) {
        console.log('Migration status: HE DED', err);
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
        .catch(e => {
            console.log('ERR', e);
            process.exit(1);
        });
});
