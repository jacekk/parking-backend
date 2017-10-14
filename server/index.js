const express = require('express');
const app = express();

/*
    name: string,
    freePlaces: number
*/

const fakeParkings = [
    {
        name: 'Renoma',
        freePlaces: 230
    },
    {
        name: 'Nowy Targ',
        freePlaces: 30
    },
    {
        name: 'Galeria Dominikańska',
        freePlaces: 0
    },
]

app.get('/parkings', (req, res) => {
    res.send(fakeParkings);
});

app.listen('3000', () => {
    console.log('Running on http://localhost:3000');
});
