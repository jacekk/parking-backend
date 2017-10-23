import React from 'react';
import PropTypes from 'prop-types';
import UserDistanceToSpot from '../UserDistanceToSpot';
import { getFreeSpotsStateName } from '../../helpers';

import './ParkingListItem.css';

const ParkingListItem = ({
    name,
    freeSpots,
    onClick,
    spotCoordinates,
}, {
    userCoordsDenied,
}) => (
    <li className="parkingListItem" onClick={onClick}>
        <h3 className="parkingListItem-name">{name}</h3>
        <span className="parkingListItem-data">
            <label className="parkingListItem-label">Miejsca</label>
            <span className={`parkingListItem-spot parkingListItem-spot--${getFreeSpotsStateName(freeSpots)}`}>{freeSpots}</span>
        </span>
        { !userCoordsDenied &&
            <span className="parkingListItem-data">
                <label className="parkingListItem-label">Dystans</label>
                <span className="parkingListItem-distance">
                    <UserDistanceToSpot spotCoordinates={spotCoordinates} />
                </span>
            </span>
        }
    </li>
);

ParkingListItem.contextTypes = {
    userCoordsDenied: PropTypes.bool,
};

export default ParkingListItem;
