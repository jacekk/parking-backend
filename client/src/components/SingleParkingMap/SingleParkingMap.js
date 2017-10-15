import React from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';
import LocationMarker from './LocationMarker';
import { isEqual } from 'lodash';

class SingleParkingMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            directions: null,
        };

        this.directionsLoading = false;
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps, this.props) || (!this.state.directions && !this.directionsLoading)) {
            this.updateDirections();
        }
    }

    updateMap(map) {
        if (!map) {
            return;
        }
        const { lat, long, userPosition } = this.props;

        if (userPosition) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(new window.google.maps.LatLng(lat, long));
            bounds.extend(new window.google.maps.LatLng(userPosition.lat, userPosition.long));
            map.fitBounds(bounds);
        }
    }

    updateDirections() {
        const { lat, long, userPosition } = this.props;

        if (!lat || !long || !userPosition) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        const origin = new window.google.maps.LatLng(userPosition.lat, userPosition.long);
        const destination = new window.google.maps.LatLng(lat, long);

        this.directionsLoading = true;
        directionsService.route({
            origin,
            destination,
            travelMode: 'DRIVING'
        }, (result, status) => {
            if (status === 'OK') {
                this.setState({ directions: result });
            } else {
                console.error('Directions request failed due to ' + status);
            }

            this.directionsLoading = false;
        });
    }

    render() {
        const { lat, long, userPosition } = this.props;

        return (
            <GoogleMap
                ref={map => this.updateMap(map)}
                defaultZoom={14}
                defaultCenter={{ lat: lat, lng: long }}
            >
                <Marker position={{ lat: lat, lng: long }} />
                { userPosition &&
                    <LocationMarker {...userPosition} />
                }
                {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
            </GoogleMap>
        );
    }
}


export default withGoogleMap(SingleParkingMap);
