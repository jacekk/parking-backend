const { fetchAndParseParkings, startSynchronizingWithAPI } = require('../data-fetch');
const { API_PORT, SYNC_INTERVAL } = require('../constants');
const { getRepository } = require('../repository');

const appListenCallback = err => {
    if (err) {
        throw 'App died';
    }
    console.log(`App is running on port ${API_PORT}.`);
};

const startApp = (app) => {
    fetchAndParseParkings().then(({ locations, entries }) => {
        getRepository()
            .then(repository => {
                startSynchronizingWithAPI(repository, SYNC_INTERVAL);
                app.listen(API_PORT, appListenCallback);
            })
            .catch(err => console.error(err));
    });
};

module.exports = { startApp };
