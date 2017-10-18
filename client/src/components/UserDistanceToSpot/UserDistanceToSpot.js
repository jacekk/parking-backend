import { Component } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';

class UserDistanceToSpot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distanceText: null,
            isLoading: false,
        };
        this.onDistanceFetched = this.onDistanceFetched.bind(this);
    }

    componentDidMount() {
        this.fetchDistance();
    }

    fetchDistance() {
        const { spotCoordinates, userCoordinates, userCoordinatesLoading } = this.props;

        if (!window.google || !window.google.maps) {
            return;
        }
        if (userCoordinatesLoading || !spotCoordinates) {
            return;
        }

        const matrixService = new window.google.maps.DistanceMatrixService();
        const origin = new window.google.maps.LatLng(userCoordinates.lat, userCoordinates.long);
        const destination = new window.google.maps.LatLng(spotCoordinates.lat, spotCoordinates.long);

        this.setState({
            isLoading: true,
            distanceText: null,
        }, () => {
            matrixService.getDistanceMatrix({
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING'
            }, this.onDistanceFetched);
        });
    }

    onDistanceFetched(response, status) {
        this.setState({ isLoading: false });

        if (status !== 'OK') {
            throw new Error('DistanceMatrixService.getDistanceMatrix failed with status: ', status);
        }

        const distanceText = get(response, 'rows.0.elements.0.distance.text');

        if (distanceText && distanceText.length) {
            this.setState({ distanceText });
        } else {
            setTimeout(() => {
                this.fetchDistance();
            }, 10e3);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (isEqual(this.props, prevProps)) {
            return;
        }
        this.fetchDistance();
    }

    render() {
        if (this.state.isLoading || this.props.userCoordinatesLoading) {
            return '...';
        }

        return this.state.distanceText || '?';
    }
};

UserDistanceToSpot.propTypes = {
    userCoordinatesLoading: PropTypes.bool,
    spotCoordinates: PropTypes.shape({
        lat: PropTypes.number,
        long: PropTypes.number,
    }),
    userCoordinates: PropTypes.shape({
        lat: PropTypes.number,
        long: PropTypes.number,
    }),
};

export default UserDistanceToSpot;
