#!/usr/bin/env nodejs

const getCSV = require('get-csv');
const C = require('./constants');

const fetchError = (err) => {
    console.error('Fetch error', err);
}

const fetchSuccess = (rows) => {
    const withoutHeaders = rows.slice(1);

    console.log('number of rows', withoutHeaders.length);
};
    
const run = () => {
    getCSV(C.CSV_FILE_URL, { headers: false })
        .then(fetchSuccess)
        .catch(fetchError)
    ;
};

run();
