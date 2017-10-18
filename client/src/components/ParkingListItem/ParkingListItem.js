import React from 'react';
import UserDistanceToSpot from '../UserDistanceToSpot';
import { getFreeSpotsClassName } from '../../helpers';

import './ParkingListItem.css';

const ParkingListItem = ({
    name,
    freeSpots,
    onClick,
    spotCoordinates,
    userCoordinates,
    userCoordinatesLoading
}) => (
    <li className="parkingList-item" onClick={onClick}>
        <h3 className="parking-name">{name}</h3>
        <span className="parking-data">
            <label className="parking-label">Miejsca</label>
            <span className={getFreeSpotsClassName(freeSpots)}>{freeSpots}</span>
        </span>
        <span className="parking-data">
            <label className="user-distance-label">Dystans</label>
            <span className="user-distance">
                <UserDistanceToSpot
                    userCoordinatesLoading={userCoordinatesLoading}
                    spotCoordinates={spotCoordinates}
                    userCoordinates={userCoordinates}
                />
            </span>
        </span>
    </li>
);

export default ParkingListItem;
