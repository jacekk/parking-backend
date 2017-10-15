import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const SingleParkingMap = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
      defaultZoom={14}
      defaultCenter={{ lat: props.lat, lng: props.long }}
  >
      <Marker position={{ lat: props.lat, lng: props.long }} />
  </GoogleMap>
));


export default SingleParkingMap;
