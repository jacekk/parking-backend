const moment = require('moment');

const { getRepository } = require('../repository');
const { mapPredictions } = require('../predictions');

const getLocations = async (req, res) => {
    const repo = await getRepository();

    try {
        const parkings = await repo.getParkings();

        if (!parkings || parkings.length === 0) {
            res.status(404).end();
        }

        res.send(parkings);
    } catch (err) {
        res.status(500).end();
    }

};

const getLocationHistory = async (req, res) => {
    const repo = await getRepository();

    try {
        const entries = await repo.getParkingEntriesByIdAndTime(
            req.params.id,
            {
                $gte: moment().subtract(4, 'hours').toDate()
            }
        );

        if (!entries || entries.length === 0) {
            res.status(404).end();
        }

        res.send(entries);
    } catch (err) {
        console.log(err)
        res.status(500).end(err);
    }
};

const getLocationPredictions = async (req, res) => {
    const parkingId = req.params.id;
    const repo = await getRepository();

    try {
        const parkings = await repo.getParkings();
        const parking = parkings.filter(item =>
            item.id.toString() === parkingId.toString()
        )[0];

        if (!parking) {
            return res.status(404).end();
        }

        const weekBeforeNow = moment().subtract(7, 'days').subtract(1, 'day');
        const entries = await repo.getParkingEntriesByIdAndTime(
            parkingId,
            {
                $gte: weekBeforeNow.toDate(),
                $lte: moment(weekBeforeNow).add(4, 'hours').toDate()
            }
        );

        if (!entries || entries.length === 0) {
            return res.status(404).end();
        }

        res.send(mapPredictions(entries, parking.freeSpots));
    } catch (err) {
        console.log(err);
        res.status(500).end(err);
    }
};

module.exports = {
    getLocations,
    getLocationHistory,
    getLocationPredictions,
};
