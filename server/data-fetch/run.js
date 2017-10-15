#!/usr/bin/env nodejs
const uuid = require('uuid');
const getCSV = require('get-csv');
const C = require('./constants');

const fetchError = (err) => {
    console.error('Fetch error', err);
}

const parse = (parsedEntries = [], groupedEntriesByLocation = {}, line) => {
    const [time, freeSpots, carsIn, carsOut, location] = line.split(';');

    const newEntry = {
        name: location,
        time: new Date(time),
        freeSpots: +freeSpots,
        carsIn: +carsIn,
        carsOut: +carsOut,
    };

    if (!groupedEntriesByLocation[location]) {
      groupedEntriesByLocation[location] = [];
    }

    parsedEntries.push(newEntry);
    groupedEntriesByLocation[location].push(newEntry);
}

const fetchSuccess = (lines) => {
    if (!Array.isArray(lines)) {
        return new Error('Returned "lines" is not an array.');
    }

    let parsedEntries = [];
    const groupedEntriesByLocation = {};

    Object.keys(lines).forEach((lineIndex) => {
        const line = lines[lineIndex].replace('�', 'Ś'); // @todo fix that somehow

        if (line.indexOf('Czas_Rejestracji') > -1) {
            return;
        }

        if (!line) {
            return;
        }

        parse(parsedEntries, groupedEntriesByLocation, line);
    });

    const locationIdMap = {};
    const locations = Object.keys(groupedEntriesByLocation).map(location => {
        const locationId = uuid.v4();
        locationIdMap[location] = locationId;

        return {
            id: locationId,
            name: location,
        };
    });

    parsedEntries = parsedEntries.map(entry => ({
        locationId: locationIdMap[entry.name],
        ...entry
    }));

    return {
        locations: locations,
        entries: parsedEntries,
    };
};

const run = () => {
    return getCSV(
            C.CSV_FILE_URL,
            { headers: false, encoding: 'utf8' }
        )
        .then(fetchSuccess)
        .catch(fetchError)
    ;
};

module.exports = {
    fetchAndParseParkings: run,
}
