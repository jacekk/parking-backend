#!/usr/bin/env nodejs
const uuid = require('uuid');
const getCSV = require('get-csv');
const moment = require('moment');

const { CSV_FILE_URL, WRO_OPEN_DATA_TZ } = require('./constants');

const sortEntries = (curr, next) => moment(curr.time).isBefore(next.time) ? 1 : -1;

const normalizeCsvDate = (src) => [
    src.split('.')[0],
    WRO_OPEN_DATA_TZ,
].join('');

const parse = (parsedEntries = [], groupedEntriesByLocation = {}, line) => {
    const [time, freeSpots, carsIn, carsOut, location] = line.split(';');
    const parsedTime = moment(normalizeCsvDate(time)).toDate();

    const newEntry = {
        name: location,
        time: parsedTime,
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
        // Impossible to fix that char even with 'node-unidecode' package. Any cmobination of encoding does NOT work.
        const line = lines[lineIndex].replace('�', 'ś');

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

        return { name: location };
    });

    parsedEntries = parsedEntries.sort(sortEntries);

    return {
        locations: locations,
        entries: parsedEntries,
    };
};

const fetchAndParseParkings = () => {
    return getCSV(
            CSV_FILE_URL,
            { headers: false, encoding: 'utf8' }
        )
        .then(fetchSuccess)
        .catch(err => console.error('Fetch error', err))
    ;
};

const syncLocations = async (repo, locations) => {
    const persistedLocations = await repo.getLocations();
    console.log(
        '############ SYNC_LOCATIONS ############',
        'all:',
        locations.length,
        '| persisted:',
        persistedLocations.length,
        '############'
    );
    const newLength = locations.length - persistedLocations.length;
    if (newLength > 0) {
        console.log('############ SYNC_ADDING_LOCATIONS ############')
        await repo.addParkingLocation(locations);
    }
    console.log('############ SYNC_LOCATIONS_FINISHED ############ added:', newLength)
}

const synchronize = async (repo) => {
    console.log('############ SYNC_INIT ############')
    const { locations, entries } = await fetchAndParseParkings();
    const latestPersistedEntry = await repo.getLatestEntry();

    await syncLocations(repo, locations);

    let entriesToInsert = [];
    let shouldSync = false;

    if (!latestPersistedEntry) {
        entriesToInsert = entries;
        shouldSync = true;
    } else {
        entriesToInsert = entries
            .filter(entry =>
                moment(latestPersistedEntry.time).isBefore(entry.time)
            );
        shouldSync = entriesToInsert.length > 0;
    }

    if (!shouldSync) {
        console.log('############ SYNC_ENTRIES_NOTHING ############')
        return;
    }

    const entriesWithLocationId = await Promise.all(
        entriesToInsert.map(async entry => {
            const location = await repo.findLocationIdByName(entry.name);

            return {
                ...entry,
                locationId: location._id,
            }
        })
    ) || [];


    entriesWithLocationId.sort((curr, next) => moment(curr.time).isBefore(next.time) ? 1 : -1);

    console.log('############ SYNC_ENTRIES_START ############');
    await repo.addParkingEntry(entriesWithLocationId);
    console.log('############ SYNC_ENTRIES_FINISH ############ added:', entriesWithLocationId.length);
};

const startSynchronizingWithAPI = (repo, interval) => {
    synchronize(repo)
        .then(() => console.log('Startup synchronization complete'));

    return setInterval(() => synchronize(repo), interval)
}

module.exports = {
    fetchAndParseParkings,
    startSynchronizingWithAPI
}
