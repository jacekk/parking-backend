import React from 'react';

import './ParkingList.css';

const ParkingList = ({ items, ItemComponent }) => (
    <ul className="parkingList">
        { items.map(props => <ItemComponent {...props}/>) }
    </ul>
);

export default ParkingList;
