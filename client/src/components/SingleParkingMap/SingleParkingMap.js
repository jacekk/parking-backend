import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import LocationMarker from './LocationMarker';

const updateMap = (map, { lat, long, userPosition }) => {
    if (!map) {
        return;
    }

    const Maps = google.maps; // eslint-disable-line no-undef

    if (userPosition) {
        const bounds = new Maps.LatLngBounds();
        bounds.extend(new Maps.LatLng(lat, long));
        bounds.extend(new Maps.LatLng(userPosition.lat, userPosition.long));
        map.fitBounds(bounds);
    }
};

const SingleParkingMap = withGoogleMap((props) => {
    const { lat, long, userPosition } = props;

    return (
        <GoogleMap
            ref={map => updateMap(map, props)}
            defaultZoom={14}
            defaultCenter={{ lat: lat, lng: long }}
            containerElement={<div style={{ height: `400px` }} />}
        >
            <Marker position={{ lat: lat, lng: long }} />
            { userPosition &&
                <LocationMarker {...userPosition} />
            }
        </GoogleMap>
    );
});


export default SingleParkingMap;
