import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Rectangle} from 'recharts';

import { getFreeSpotsClassName, getFreeSpotsColor } from '../../helpers';

const CustomBar = (props) => {
    const fill = getFreeSpotsColor(props.freeSpots);
    return <Rectangle {...props} fill={fill} />
  };

const ParkingDetails = ({
    detailsPageActiveClassName,
    goBack,
    activeParking,
    activeParkingChartData,
}) =>
    <div className={`active-page ${detailsPageActiveClassName}`}>
            <header className="app-header">
                <button className="app-back" onClick={goBack}>Powrót</button> <h1 className="app-title">parkly</h1>
            </header>
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
            </section>
        </div>


export default ParkingDetails;
