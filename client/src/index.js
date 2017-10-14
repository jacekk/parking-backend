import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const SERVER_URL = 'http://localhost:3000';
const PARKINGS_ROUTE = 'parkings';

const getAllParkings = () =>
    axios
        .get(`${SERVER_URL}/${PARKINGS_ROUTE}`)
        .then(resp => resp.data)
        .catch(console.error);

ReactDOM.render(<App getParkings={getAllParkings}/>, document.getElementById('root'));
registerServiceWorker();
