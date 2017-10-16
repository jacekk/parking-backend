const { fetchAndParseParkings, startSynchronizingWithAPI } = require('../data-fetch');
const { SYNC_INTERVAL } = require('../constants');
const { getRepository } = require('../repository');

const startApp = (app) => {
    fetchAndParseParkings().then(({ locations, entries }) => {
        getRepository()
            .then(repository => {
                startSynchronizingWithAPI(repository, SYNC_INTERVAL);
                app.listen('4000', err => {
                    if (err) {
                        return console.error('App died');
                    }
                    console.log('App running on 4000');
                });
            })
            .catch(err => console.error(err));
    });
};

module.exports = { startApp };
