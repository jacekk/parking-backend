#!/usr/bin/env nodejs

const getCSV = require('get-csv');
const C = require('./constants');

const fetchError = (err) => {
    console.error('Fetch error', err);
}

const appendParsed = (parsed = [], line) => {
    const [time, freeSpots, carsIn, carsOut, location] = line.split(';');
    
    const newEntry = {
        name: location,
        time: new Date(time),
        freeSpots: +freeSpots,
        carsIn: +carsIn,
        carsOut: +carsOut,
    };
    
    parsed.push(newEntry);
}

const fetchSuccess = (lines) => {
    if (!Array.isArray(lines)) {
        return new Error('Returned "lines" is not an array.');
    }
    const parsed = [];
    Object.keys(lines).forEach((lineIndex) => {
        const line = lines[lineIndex][0];

        if (line.indexOf('Czas_Rejestracji') > -1) {
            return;
        }
        
        if (!line) {
            return;
        }

        appendParsed(parsed, line);
    });

    console.log(parsed)
};
    
const run = () => {
    getCSV(C.CSV_FILE_URL, { headers: false })
        .then(fetchSuccess)
        .catch(fetchError)
    ;
};

module.exports = {
    fetchAndParseParkings: run,
}