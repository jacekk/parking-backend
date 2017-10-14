import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const SERVER_URL = 'http://localhost:4000';
const PARKINGS_ROUTE = 'parkings';
const HISTORY_ROUTE = 'mocked/history';
const PREDICTIONS_ROUTE = 'mocked/predictions';

const getParkings = () =>
    axios
        .get(`${SERVER_URL}/${PARKINGS_ROUTE}`)
        .then(resp => resp.data)
        .catch(console.error);


const getHistory = (parkingName) =>
    axios
        .get(`${SERVER_URL}/${HISTORY_ROUTE}/${parkingName}`)
        .then(resp => resp.data)
        .catch(console.error);


const getPredictions = (parkingName) =>
        axios
            .get(`${SERVER_URL}/${PREDICTIONS_ROUTE}/${parkingName}`)
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
