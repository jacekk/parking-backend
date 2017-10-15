import { Component } from 'react';
import { get, isEqual } from 'lodash';

class UserDistanceToSpot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceText: null,
            isLoading: false,
            spotId: null,
        };
    }
    componentDidMount() {
        this.fetchDistance();
    }

    fetchDistance() {
        const {
            userCoordinates,
            spotCoordinates,
            userCoordinatesLoading,
        } = this.props;

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

        this.setState({
            isLoading: true,
            distanceText: null,
        }, () => {
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
        });
    }
    componentDidUpdate(prevProps, prevState) {

        if (
            isEqual(this.props.spotId, prevProps.spotId)
            && (this.state.isLoading || this.state.distanceText)
        ) {
            return;
        }
        this.fetchDistance();
    }

    render() {
        if (this.state.isLoading || this.props.userCoordinatesLoading) {
            return 'loading...';
        }

        return this.state.distanceText || '-';
    }
}

export default UserDistanceToSpot;
