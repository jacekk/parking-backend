import React from 'react';
import PropTypes from 'prop-types';
import {BarChart, Bar, ResponsiveContainer, Rectangle} from 'recharts';

import SingleParkingMap from '../SingleParkingMap';
import UserDistanceToSpot from '../UserDistanceToSpot';
import Header from '../Header';
import Cards from '../Cards';
import Card from '../Card';
import { getFreeSpotsColor, getFreeSpotsColorBorder, getFreeSpotsStateName } from '../../helpers';

import './ParkingDetails.css';

const FUTURE_COLOR = '#a94700';
const PAST_COLOR = '#000';

const CustomBar = (props) => {
    const fill = props.isNow || !props.isFuture ? PAST_COLOR : FUTURE_COLOR;

    return <Rectangle {...props} fill={fill} />;
};

const ParkingDetails = ({
    backButtonHandler,
    activeParking,
    activeParkingChartData,
    trend,
    nowIndex,
}, {
    userCoordsDenied,
}) => {
    const CustomLabel = (props) => {
        if (props.index !== nowIndex) {
            return null;
        }

        const fill = props.isNow ?
            getFreeSpotsColorBorder(props.freeSpots, props.isFuture) :
            getFreeSpotsColor(props.freeSpots, props.isFuture);

        return (
            <g>
                <text
                    {...props}
                    x={props.x + props.width / 2}
                    y={props.y - 10}
                    fontFamily="Overpass" textAnchor="middle" fontSize="14"
                    fill={fill}
                >
                    {props.value}
                </text>
            </g>
        );
    };

    const freeSpotsClassName = `parkingDetails-spot--${getFreeSpotsStateName(activeParking.freeSpots)}`;

    return [
        <Header isBackButtonVisible backButtonHandler={backButtonHandler}/>,
        <section className="app-body parkingDetails">
            <h3 className="parkingDetails-name">{activeParking.name}</h3>
            <Cards>
                <Card label="Wolne miejsca obecnie" className={freeSpotsClassName}>
                    {activeParking.freeSpots}
                </Card>
                <Card label="Trend">
                    {trend}
                </Card>
                { !userCoordsDenied &&
                    <Card label="Dystans">
                        <UserDistanceToSpot spotCoordinates={activeParking.coordinates} />
                    </Card>
                }
                <Card>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={activeParkingChartData} margin={{ top: 25, right: 5, bottom: 5, left: 5 }}>
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
                    />
                </div>
            }
        </section>
    ];
};

ParkingDetails.contextTypes = {
    userCoordsDenied: PropTypes.bool,
};


export default ParkingDetails;
