const express = require('express');
const app = express();
const cors = require('cors');
const { getRepository } = require('./repository');
const { fetchAndParseParkings } = require('./data-fetch/run');

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

/*
    name: string,
    freePlaces: number
*/
const fakeParkings = [
    {
        name: 'Renoma',
        freePlaces: 230,
    },
    {
        name: 'Nowy Targ',
        freePlaces: 30,
    },
    {
        name: 'Galeria Dominikańska',
        freePlaces: 0,
    },
];

app.use(cors());
app.get('/parkings', (req, res) => {
    res.send(fakeParkings);
});

app.listen('4000', () => {
    console.log('Running on http://localhost:4000');
});
