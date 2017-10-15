import React from 'react';
import { Marker } from 'react-google-maps';

const LocationMarker = ({ lat, long }) => {
    const Maps = google.maps; // eslint-disable-line no-undef

    return (
        <Marker
            icon = {{
                size: new Maps.Size(80, 80),
                origin: new Maps.Point(0, 0),
                anchor: new Maps.Point(40, 40),
                url: `data:image/svg+xml;utf-8,
                <svg width="80px" height="80px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g fill="#2b81f6" fill-opacity="0.4" stroke-width="1" stroke="#1a5eb9" stroke-opacity="0.8">
                      <circle cx="50" cy="50" r="30">
                        <animate attributeName="r" begin="-1s" dur="3s" values="0;50" keyTimes="0;1" keySplines="0.1,0.2,0.3,1" calcMode="spline" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-opacity" begin="-1s" dur="3s" values="0;.8;.8;0" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" begin="-1s" dur="3s" values="0;.4;.4;0" repeatCount="indefinite"></animate>
                      </circle>
                      <circle cx="50" cy="50" r="50">
                        <animate attributeName="r" begin="0s" dur="3s" values="0;50" keyTimes="0;1" keySplines="0.1,0.2,0.3,1" calcMode="spline" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-opacity" begin="0s" dur="3s" values="0;.8;.8;0" repeatCount="indefinite"></animate>
                        <animate attributeName="fill-opacity" begin="0s" dur="3s" values="0;.4;.4;0" repeatCount="indefinite"></animate>
                      </circle>
                    </g>
                </svg>`
            }}
            options={{optimized: false}}
            position={{ lat: lat, lng: long}}
        />
    );
};

export default LocationMarker;
