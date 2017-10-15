const moment = require('moment');

const mapPredictions = (entries, currentFreeSpots) => {
    const factor = currentFreeSpots / entries[0].freeSpots;

    return entries.map(item =>
        ({
            ...item,
            time: moment(item.time).add(1, 'day').toDate(),
            freeSpots: Math.round(factor * item.freeSpots),
        })
    );
};

module.exports = {
    mapPredictions,
};
