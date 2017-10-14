const moment = require('moment');

const mapPredictions = (entries) => entries.map(item => ({
    ...item,
    time: moment(item.time).add(1, 'day').toDate(),
}));

module.exports = {
    mapPredictions,
};
