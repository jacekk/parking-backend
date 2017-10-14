const express = require('express');
const app = express();
const cors = require('cors');
const { getCollection } = require('./repository');
const { fetchAndParseParkings } = require('./data-fetch/run');

getCollection((err, collection) => {
  if (err === null) {
    console.log("connected successfully");
  } else {
    console.log("DATABASE ERROR!!!!");
  }

  collection.insert({ test: 'test' }, (err, result) => {
    console.log('inserted data successfully!!!', result);
  });
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
