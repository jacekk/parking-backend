const mongoHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'mongodb';

exports.MONGODB_URL = `mongodb://${mongoHost}:27017/parkly`;
exports.MONGODB_LOCAL_URL = `mongodb://localhost:27017/parkly`;

exports.CSV_FILE_URL = 'https://www.wroclaw.pl/open-data/opendata/its/parkingi/parkingi.csv';
exports.WRO_OPEN_DATA_TZ = '+02:00';
exports.SYNC_INTERVAL = 1 * 60 * 1e3; // 1 min;
