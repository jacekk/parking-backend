import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import moment from 'moment';
import 'moment-timezone';
import regression from 'regression';
import Header from './components/Header';
import Spinner from './components/Spinner';
import ParkingDetails from './components/ParkingDetails';
import ParkingListItem from './components/ParkingListItem';
import ParkingList from './components/ParkingList';
import ErrorMessage from './components/ErrorMessage';

class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            parkings: [],
            history: [],
            predictions: [],
            errorMessage: null,
            activeParkingName: null,
            spinner: false,
            userCoordsLoading: true,
            userCoordsDenied: false,
            userCoords: null,
        };

        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.showListPage = this.showListPage.bind(this);
        this.showDetailsPage = this.showDetailsPage.bind(this);
        this.updateUserPosition = this.updateUserPosition.bind(this);
        this.disableUserPosition = this.disableUserPosition.bind(this);
        this.mapStateParkingToListItem = this.mapStateParkingToListItem.bind(this);
    }

    getChildContext() {
        return {
            userCoordsLoading: this.state.userCoordsLoading,
            userCoordsDenied: this.state.userCoordsDenied,
            userCoords: this.state.userCoords,
        };
    }

    updateUserPosition(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        this.setState({
            userCoordsLoading: false,
            userCoords: { lat, long },
        });
    }

    showListPage(ev) {
        ev.preventDefault();
        this.setState({
            activeParkingName: null,
            history: [],
            predictions: [],
        });
    }

    showDetailsPage(ev, parkingName, parkingId) {
        ev.preventDefault();
        this.setState({
            activeParkingName: parkingName,
            spinner: true,
        });
        Promise.all([
            this.props.getHistory(parkingId),
            this.props.getPredictions(parkingId),
        ]).then(([ history = [], predictions = []]) => {
            this.setState({
                history,
                predictions,
                spinner: false
            })
        }).catch(error => {
            this.setState({
                spinner: false
            });
            this.setErrorMessage(
                <div>
                    <p><strong>Wystąpił nieoczekiwany błąd.</strong></p>
                    <p>Prosimy spróbować później.</p>
                </div>
            );
        })
    }

    componentDidMount() {
        if (navigator && navigator.geolocation) {
            this.setState({ userCoordsLoading: true });
            navigator.geolocation.getCurrentPosition(
                this.updateUserPosition,
                this.disableUserPosition,
                { timeout: 10e3 }
            );
        }

        this.setState({
            spinner: true
        });

        this.getParkings().then(() => {
            this.setState({
                spinner: false
            });
        });
    }

    disableUserPosition(error) {
        this.setState({
            userCoordsDenied: true,
            userCoordsLoading: false,
        });
        console.error(error.message || error);
    }

    getParkings() {
        return this.props.getParkings()
        .then((parkings = []) => {
            this.setState(() => ({
                parkings
            }));

            if (parkings.length) {
                return;
            }
            this.setErrorMessage(
                <div>
                    <p><strong>Brak wyników.</strong></p>
                    <p>Prosimy spróbować później.</p>
                </div>
            );
        }).catch(error => {
            this.setErrorMessage(
                <div>
                    <p><strong>Wystąpił nieoczekiwany błąd.</strong></p>
                    <p>Prosimy spróbować później.</p>
                </div>
            );
            throw error;
        })
    }

    setErrorMessage(errorMessage) {
        this.setState({ errorMessage });
    }

    renderErrorMessage() {
        const { errorMessage } = this.state;
        if (!errorMessage) {
            return null;
        }
        return (
            <ErrorMessage onClick={this.closeErrorMessage}>
                { errorMessage }
            </ErrorMessage>
        );
    }

    closeErrorMessage() {
        this.setState({
            errorMessage: null
        });
    }

    getActiveParking() {
        const { activeParkingName, parkings } = this.state;
        return parkings.filter(({ name }) => name === activeParkingName)[0] || {};
    }

    getActiveParkingChartData() {
        const { history, predictions } = this.state;
        const historyChartData = history.map(({ freeSpots, time }, index) => ({
            freeSpots,
            time: moment(time).subtract({'hours': 2}).fromNow(),
            isNow: index === history.length - 1,
            isFuture: false,
        }));
        const predictionsChartData = predictions.map(({ freeSpots, time }, index) => ({
            freeSpots,
            time: moment(time).fromNow(),
            isFuture: true,
            isNow: false
        }));
        return historyChartData.concat(predictionsChartData);
    }

    getBarChartWidth() {
        return window.innerWidth - 50;
    }

    getTrend() {
        const { history } = this.state;

        const data = history
            .filter((_, index) => index >= history.length - 5)
            .map(({ freeSpots, time }) => ([
                moment(time).unix(),
                freeSpots,
            ]));
        const linearRegression = regression.linear(data);
        const coefficient = linearRegression.equation[0];

        if (coefficient === 0) {
            return "Stały"
        }

        return coefficient > 0 ? "Wzrostowy" : "Spadkowy";
    }

    mapStateParkingToListItem({ name, freeSpots, coordinates, id }) {
        return {
            key: id,
            name: name,
            spotCoordinates: coordinates,
            freeSpots: freeSpots,
            onClick: ev => this.showDetailsPage(ev, name, id),
        };
    }

    render() {
        const { activeParkingName } = this.state;
        const listPageActiveClassName = !activeParkingName ? 'app-page--visible' : 'app-page--hidden';
        const detailsPageActiveClassName = activeParkingName ? 'app-page--visible' : 'app-page--hidden';
        const activeParking = this.getActiveParking();
        const activeParkingChartData = this.getActiveParkingChartData();

        return (
            <div className="app">
                <div className={`app-page ${listPageActiveClassName}`}>
                    <Header />
                    <Spinner className="spinner" visible={this.state.spinner}/>
                    { this.renderErrorMessage() }
                    <section>
                        <ParkingList
                            items={this.state.parkings.map(this.mapStateParkingToListItem)}
                            ItemComponent={ParkingListItem}
                        />
                    </section>
                </div>
                <div className={`app-page ${detailsPageActiveClassName}`}>
                    <ParkingDetails
                        activeParking={activeParking}
                        activeParkingChartData={activeParkingChartData}
                        trend={this.getTrend()}
                        backButtonHandler={this.showListPage}
                        nowIndex={this.state.history.length - 1}
                    />
                </div>
            </div>
        );
    }
}

App.defaultProps = {
    getParkings: () => Promise.resolve(),
    getHistory: () => Promise.resolve(),
    getPredictions: () => Promise.resolve(),
};

App.childContextTypes = {
    userCoordsLoading: PropTypes.bool,
    userCoordsDenied: PropTypes.bool,
    userCoords: PropTypes.shape({}),
}

export default App;
