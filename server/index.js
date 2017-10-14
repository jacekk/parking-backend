const express = require('express');
const app = express();
const cors = require('cors');

const repository = require('./repository');

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

repository.getConnection((err, db) => {
    if (err === null) {
        console.log('connected successfully');
    }

    db.close();
});

app.listen('4000', () => {
    console.log('Running on http://localhost:4000');
});
