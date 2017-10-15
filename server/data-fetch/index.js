#!/usr/bin/env nodejs
const uuid = require('uuid');
const getCSV = require('get-csv');
const moment = require('moment');
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
            // id: locationId,
            name: location,
        };
    });

    parsedEntries = parsedEntries
    // .map(entry => ({
    //     // locationId: locationIdMap[entry.name],
    //     ...entry
    // }))
    .sort((curr, next) => moment(curr.time).isBefore(next.time) ? 1 : -1);

    return {
        locations: locations,
        entries: parsedEntries,
    };
};

const fetchAndParseParkings = () => {
    return getCSV(
            C.CSV_FILE_URL,
            { headers: false, encoding: 'utf8' }
        )
        .then(fetchSuccess)
        .catch(fetchError)
    ;
};

const startSynchronizingWithAPI = repo => {
    return setInterval(async () => {
        console.log('############ SYNC_INIT ############')
        const { locations, entries } = await fetchAndParseParkings();
        const latestPersistedEntry = await repo.getLatestEntry();

        // await repo.addParkingLocation(locations)

        if (
            latestPersistedEntry && entries[0] &&
            moment(latestPersistedEntry.time)
                .isSameOrAfter(entries[0].time)
            ) {
                console.log('############ NOTHING_TO_SYNC ############')
                return;
            }
            
            console.log('############ SYNC_START ############')
            await repo.addParkingEntry(entries)
            console.log('############ SYNC_FINISH ############')
                    
    }, 5 * 1000)
}

module.exports = {
    fetchAndParseParkings,
    startSynchronizingWithAPI
}
