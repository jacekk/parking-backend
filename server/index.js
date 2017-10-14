const express = require('express');
const app = express();
const cors = require('cors');
const moment = require('moment');

const { getRepository } = require('./repository');
const { fetchAndParseParkings } = require('./data-fetch/run');

const parkingsMock = require('./mocks/parkings');
const historyMock = require('./mocks/history');
const predictionsMock = require('./mocks/predictions');

const now = new Date();

fetchAndParseParkings().then(({ locations, entries }) => {
  getRepository()
    .then((repository) => {
      Promise.all([
          repository.addParkingLocation(locations), 
            repository.addParkingEntry(entries)]
      ).then(() => {
          app.listen('4000', err => {
            if (err) {
                console.log('He ded')
            }

            console.log('Running on 4000');
          })
      })
    })
    .catch(err => console.log(err));
});

app.use(cors());

app.get('/parkings', async (req, res) => {
    const repo = await getRepository();
    
    try {

        const parkings =  await repo.getParkings();

        if (!parkings || parkings.length === 0) {
            res.status(404).end();
        }

        res.send(parkings);
    } catch (err) {
        res.status(500).end();
    }

});

app.get('/history/:id', async (req, res) => {
    const repo = await getRepository();
    
    try {
        const now = new Date();
        const entries =  await repo.getParkingEntriesByIdAndTime(
            req.params.id,
            {
                $gte: moment().subtract(4, 'hours').toDate()
            }
        );

        if (!entries || entries.length === 0) {
            res.status(404).end();
        }

        res.send(entries);
    } catch (err) {
        console.log(err)
        res.status(500).end(err);
    }
});

app.get('/mocked/parkings', async (req, res) => {
    res.send(parkingsMock);
});

app.get('/mocked/history/:id?', async (req, res) => {
    res.send(historyMock);
});

app.get('/mocked/predictions/:id?', async (req, res) => {
    res.send(predictionsMock);
});

