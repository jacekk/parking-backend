import React from 'react';
import {BarChart, Label, Tooltip, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Rectangle} from 'recharts';
import SingleParkingMap from '../SingleParkingMap';
import Header from '../Header';
import { getFreeSpotsClassName, getFreeSpotsColor, getFreeSpotsColorBorder } from '../../helpers';

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
    nowIndex,
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
    }
    return (
        <div className={`active-page ${detailsPageActiveClassName}`}>
            <Header backButtonVisible backButtonHandler={backButtonHandler}/>
            <section className="app-body parking-details">
                <h3 className="parking-name">{activeParking.name}</h3>
                <span className="parking-data">
                    <label className="parking-label">Wolne miejsca obecnie</label> <span className={getFreeSpotsClassName(activeParking.freeSpots)}>{activeParking.freeSpots}</span>
                </span>
                <span className="parking-data">
                    <label className="parking-label">Trend</label> <span className="parking-trend">Wzrostowy</span>
                </span>
                <div className="parking-chart">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={activeParkingChartData} barCategoryGap={1}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey='freeSpots' shape={CustomBar} label={CustomLabel}/>
                            <XAxis dataKey="time"/>
                            <YAxis dataKey="freeSpots" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {activeParking && activeParking.coordinates &&
                    <div className="parking-map">
                        <SingleParkingMap
                          isMarkerShown
                          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: '200px' }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          lat={activeParking.coordinates.lat}
                          long={activeParking.coordinates.long}
                        />
                    </div>
                }
            </section>
        </div>
    );
};


export default ParkingDetails;
