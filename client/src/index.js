import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const SERVER_URL = process.env.NODE_ENV === 'production' ?
    '//parkly.jacek-k.net:4444' :
    'http://localhost:4000';

const PARKINGS_ROUTE = 'locations';
const HISTORY_ROUTE = 'history';
const PREDICTIONS_ROUTE = 'predictions';

const getParkings = () =>
    axios
        .get(`${SERVER_URL}/${PARKINGS_ROUTE}`)
        .then(resp => resp.data)
        .catch(console.error);


const getHistory = (parkingId) =>
    axios
        .get(`${SERVER_URL}/${HISTORY_ROUTE}/${parkingId}`)
        .then(resp => resp.data)
        .catch(console.error);


const getPredictions = (parkingId) =>
        axios
            .get(`${SERVER_URL}/${PREDICTIONS_ROUTE}/${parkingId}`)
            .then(resp => resp.data)
            .catch(console.error);

ReactDOM.render(
    (
        <App
            getParkings={getParkings}
            getHistory={getHistory}
            getPredictions={getPredictions}
        />
    ), document.getElementById('root'));

registerServiceWorker();
