const express = require('express');
const app = express();
const cors = require('cors');

const { startApp } = require('./src/app/run');
const {
    getLocations,
    getLocationHistory,
    getLocationPredictions,
} = require('./src/app/routes');

app.use(cors());
app.get('/locations', getLocations);
app.get('/history/:id', getLocationHistory);
app.get('/predictions/:id', getLocationPredictions);
startApp(app);
