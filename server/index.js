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

app.listen('4000', () => {
    console.log('Running on http://localhost:4000');
});
        // repository.getParkingEntriesByNameAndTime('Renoma', {
        //   $lte: new Date(
        //     now.getFullYear(),
        //     now.getMonth(),
        //     now.getHours() - 4
        //   )
        // })
        //   .then(entries => console.log('entries:', entries));
      });
    })
    .catch(err => console.log(err));
});

/*
    name: string,
    freeSpots: number
*/
const fakeParkings = [
    {
        name: 'Renoma',
        freeSpots: 230,
    },
    {
        name: 'Nowy Targ',
        freeSpots: 30,
    },
    {
        name: 'Galeria Dominikańska',
        freeSpots: 0,
    },
];

const fakeHistory = [
       {
         time: '2017-10-13T02:50:01.840Z',
         freeSpots: 791,
         carsIn: 10,
         carsOut: 0 },
       {
         time: '2017-10-13T02:50:01.840Z',
         freeSpots: 731,
         carsIn: 0,
         carsOut: 60 },
       {
         time: '2017-10-13T02:50:01.840Z',
         freeSpots: 791,
         carsIn: 60,
         carsOut: 0 },
]

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

app.get('/history/:parkingName', (req, res) => {
    res.send(fakeHistory);
});

