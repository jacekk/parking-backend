import React from 'react';
import {BarChart, Bar, ResponsiveContainer, Rectangle} from 'recharts';
import SingleParkingMap from '../SingleParkingMap';
import UserDistanceToSpot from '../UserDistanceToSpot';
import Header from '../Header';
import Cards from '../Cards';
import Card from '../Card';
import './ParkingDetails.css';

import { getFreeSpotsColor, getFreeSpotsColorBorder } from '../../helpers';

const CustomBar = (props) => {
    const fill = props.isNow ? getFreeSpotsColorBorder(props.freeSpots, props.isFuture) : getFreeSpotsColor(props.freeSpots, props.isFuture);
    return <Rectangle
        {...props}
        fill={fill}
    />;
};

const ParkingDetails = ({
    detailsPageActiveClassName,
    backButtonHandler,
    activeParking,
    activeParkingChartData,
    trend,
    nowIndex,
    userPosition,
    userPositionLoading,
}) => {
    const CustomLabel = (props) => {
        if (props.index !== nowIndex) {
            return null;
        }
        const fill = props.isNow ? getFreeSpotsColorBorder(props.freeSpots, props.isFuture) : getFreeSpotsColor(props.freeSpots, props.isFuture);
        return (
            <g>
                <text {...props} x={props.x + props.width / 2} y={props.y - 10} fontFamily="Overpass" textAnchor="middle" fontSize="14" fill={fill}>{props.value}</text>
            </g>
        );
    };
    return (
        <div className={`active-page ${detailsPageActiveClassName}`}>
            <Header backButtonVisible backButtonHandler={backButtonHandler}/>
            <section className="app-body parking-details">
                <h3 className="parking-name">{activeParking.name}</h3>
                <Cards>
                    <Card label="Wolne miejsca obecnie">
                        {activeParking.freeSpots}
                    </Card>

                    <Card label="Trend">
                        {trend}
                    </Card>

                    <Card label="Dystans">
                        <UserDistanceToSpot
                            spotId={activeParking.id}
                            userCoordinatesLoading={userPositionLoading}
                            spotCoordinates={activeParking.coordinates}
                            userCoordinates={userPosition}
                        />
                    </Card>

                    <Card>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={activeParkingChartData} barCategoryGap={1}>
                                <Bar dataKey='freeSpots' shape={CustomBar} label={CustomLabel}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Cards>
                {activeParking && activeParking.coordinates &&
                    <div className="parking-map">
                        <SingleParkingMap
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: '400px' }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          lat={activeParking.coordinates.lat}
                          long={activeParking.coordinates.long}
                          userPosition={userPosition}
                        />
                    </div>
                }
            </section>
        </div>
    );
};


export default ParkingDetails;
