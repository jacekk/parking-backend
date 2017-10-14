const express = require('express');
const app = express();
const cors = require('cors');

const { getRepository } = require('./repository');
const { fetchAndParseParkings } = require('./data-fetch/run');

const parkingsMock = require('./mocks/parkings');
const historyMock = require('./mocks/history');
const predictionsMock = require('./mocks/predictions');

const now = new Date();

fetchAndParseParkings().then((parkings) => {
  getRepository()
    .then((repository) => {
      repository.addParkingEntry(parkings).then(() => {
        repository.getParkingEntriesByNameAndTime('Renoma', {
          $lte: new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getHours() - 4
          )
        })
          .then(entries => console.log('entries:', entries));
      });
    })
    .catch(err => console.log(err));
});

app.use(cors());

app.get('/parkings', async (req, res) => {
    const repo = await getRepository();

    repo.getParkingEntries()

    res.send(parkingsMock);
});

app.get('/history/:parkingName', (req, res) => {
    res.send(historyMock);
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

app.listen('4000', () => {
    console.log('Running on http://localhost:4000');
});
