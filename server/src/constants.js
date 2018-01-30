const mongoHost = process.env.NODE_ENV === 'production' ? 'localhost' : 'mongodb';

exports.API_PORT = 4000;
exports.MONGODB_URL = `mongodb://${mongoHost}:27017/parkly`;

exports.CSV_FILE_URL = 'https://www.wroclaw.pl/open-data/datastore/dump/714dbecb-f0d3-4aac-bcfb-b27f1b0e88ea';
exports.WRO_OPEN_DATA_TZ = '+02:00';
exports.SYNC_INTERVAL = 1 * 60 * 1e3; // 1 min;
