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
        document.addEventListener('google-maps-loaded', () => {
            this.fetchDistance();
        });

        this.setState({
            userCoords: this.context.userCoords,
        }, () => {
            this.fetchDistance();
        });
    }

    fetchDistance() {
        const { spotCoordinates } = this.props;
        const { userCoords } = this.context;

        if (!userCoords || !spotCoordinates) {
            return;
        }
        if (!get(window, 'google.maps')) {
            return;
        }

        const matrixService = new window.google.maps.DistanceMatrixService();
        const origin = new window.google.maps.LatLng(userCoords.lat, userCoords.long);
        const destination = new window.google.maps.LatLng(spotCoordinates.lat, spotCoordinates.long);

        this.setState({
            distanceText: null,
            isLoading: true,
            userCoords,
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
        if (!isEqual(this.props, prevProps)) {
            this.fetchDistance();
            return;
        }
        if (!isEqual(this.context.userCoords, this.state.userCoords)) {
            this.fetchDistance();
            return;
        }
    }

    render() {
        if (this.state.isLoading || this.context.userCoordsLoading) {
            return '...';
        }

        return this.state.distanceText || '?';
    }
};

UserDistanceToSpot.propTypes = {
    spotCoordinates: PropTypes.shape({
        lat: PropTypes.number,
        long: PropTypes.number,
    }),
};

UserDistanceToSpot.contextTypes = {
    userCoordsLoading: PropTypes.bool,
    userCoordsDenied: PropTypes.bool,
    userCoords: PropTypes.shape({
        lat: PropTypes.number,
        long: PropTypes.number,
    }),
};

export default UserDistanceToSpot;
