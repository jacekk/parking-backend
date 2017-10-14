const express = require('express');
const app = express();
const cors = require('cors');
const { getRepository } = require('./repository');
const { fetchAndParseParkings } = require('./data-fetch/run');

getRepository()
  .then((repository) => {
    repository.addParkingEntry(fetchAndParseParkings()).then(() => {
      repository.getParkingEntries()
        .then(entries => console.log('entries:', entries));
    });
  })
  .catch(err => console.log(err));


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
    
    repo.getParkingEntries()

    res.send(fakeParkings);
});

app.get('/history/:parkingName', (req, res) => {
    res.send(fakeHistory);
});

app.listen('4000', () => {
    console.log('Running on http://localhost:4000');
});
