import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Rectangle} from 'recharts';
import SingleParkingMap from '../SingleParkingMap';
import Header from '../Header';
import { getFreeSpotsClassName, getFreeSpotsColor } from '../../helpers';

const CustomBar = (props) => {
    const fill = getFreeSpotsColor(props.freeSpots, props.isFuture);
    return <Rectangle {...props} fill={fill} />
};

const ParkingDetails = ({
    detailsPageActiveClassName,
    backButtonHandler,
    activeParking,
    activeParkingChartData,
}) =>
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
                        <BarChart data={activeParkingChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey='freeSpots' shape={CustomBar}/>
                            <XAxis dataKey="time"/>
                            <YAxis dataKey="freeSpots" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {activeParking && activeParking.coordinates &&
                    <div className="parking-map">
                        <SingleParkingMap
                          isMarkerShown
                          googleMapURL={window.GOOGLE_MAP_URL}
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


export default ParkingDetails;
