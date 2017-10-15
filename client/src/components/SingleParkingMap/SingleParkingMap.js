import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const SingleParkingMap = withScriptjs(withGoogleMap((props) => {
    const { lat, long, userPosition } = props;
    const Maps = google.maps; // eslint-disable-line no-undef
    const bounds = new Maps.LatLngBounds();
    bounds.extend(new Maps.LatLng(lat, long));

    if (userPosition) {
        bounds.extend(new Maps.LatLng(userPosition.lat, userPosition.long));
    }

    return (
        <GoogleMap
            ref={map => userPosition && map && map.fitBounds(bounds)}
            defaultZoom={14}
            defaultCenter={{ lat: lat, lng: long }}
        >
            <Marker position={{ lat: lat, lng: long }} />
            { userPosition &&
                <Marker
                    icon = {{
                        anchor: new Maps.Point(40, 40),
                        url: `data:image/svg+xml;utf-8,
                        <svg width="80px" height="80px" viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
                    position={{ lat: userPosition.lat, lng: userPosition.long }}
                />
            }
        </GoogleMap>
    );
}));


export default SingleParkingMap;
