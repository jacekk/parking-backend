import { Component } from 'react';

class UserDistanceToSpot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceText: null,
            isLoading: true,
        };
    }
    componentDidMount() {
        if (!window.google || !window.google.maps) {
            return;
        }
        const { userCoordinates, spotCoordinates, userCoordinatesLoading } = this.props;
        if (userCoordinatesLoading) {
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
                const distanceText = response.rows[0].elements[0].distance.text;
                this.setState({ distanceText });
            } else {
                console.error('matrix request failed due to ' + status);
            }
        });
    }
    render() {
        if (this.state.isLoading) {
            return 'loading...';
        }
        if (!this.state.distanceText) {
            return '-';
        }
        return this.state.distanceText;
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
