import { Component } from 'react';
import { get, isEqual } from 'lodash';

class UserDistanceToSpot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceText: null,
            isLoading: true,
            spotId: null,
        };
    }
    componentDidMount() {
        this.fetchDistance();
    }

    fetchDistance() {
        this.setState({
            spotId: this.props.spotId,
            isLoading: false,
            distanceText: null,
        });
        const { userCoordinates, spotCoordinates, userCoordinatesLoading } = this.props;
        if (!window.google || !window.google.maps) {
            return;
        }
        if (userCoordinatesLoading || !spotCoordinates) {
            return;
        }
        // const directionsService = new window.google.maps.DirectionsService;
        const matrixService = new window.google.maps.DistanceMatrixService();
        // const directionsDisplay = new window.google.maps.DirectionsRenderer;
        const origin = new window.google.maps.LatLng(
            userCoordinates.lat, userCoordinates.long);
        const destination = new window.google.maps.LatLng(
            spotCoordinates.lat, spotCoordinates.long);

        matrixService.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING'
        }, (response, status) => {
            this.setState({
                isLoading: false,
            });
            if (status === 'OK') {
                const distanceText = get(response, 'rows.0.elements.0.distance.text');
                if (distanceText && distanceText.length) {
                    this.setState({ distanceText });
                }
            } else {
                console.error('Matrix Service failed with status: ' + status);
            }
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (isEqual(this.props, prevProps)) {
            return;
        }
        // this.fetchDistance();
    }
    render() {
        if (this.state.isLoading) {
            return 'loading...';
        }
        return this.state.distanceText || '-';
    }
}

export default UserDistanceToSpot;


/*
    // const directionsService = new window.google.maps.DirectionsService;
    // const directionsDisplay = new window.google.maps.DirectionsRenderer;/*
    directionsService.route({
        origin,
        destination,
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') {
            // directionsDisplay.setDirections(response);
            console.log('route response', response);
            // console.log(directionsDisplay.setDirections(response));
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
*/
