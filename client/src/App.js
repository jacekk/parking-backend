import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import regression from 'regression';
import Header from './components/Header'
import Spinner from './components/Spinner'
import ParkingDetails from './components/ParkingDetails'
import { getFreeSpotsClassName } from './helpers';
import { getUserDistanceToSpot } from './geo';

const Parking = ({
    name,
    freeSpots,
    onClick,
    spotCoordinates,
    userCoordinates,
    userCoordinatesLoading
}) =>
    <li className="parkingList-item" onClick={onClick}>
        <h3 className="parking-name">{name}</h3>
        <span className="parking-data">
            <label className="parking-label">Miejsca</label>
            <span className={getFreeSpotsClassName(freeSpots)}>{freeSpots}</span>
            <label className="user-distance-label">Dystans</label>
            <span className="user-distance">
                {
                    userCoordinatesLoading && window.google ?
                    <Spinner visible /> :
                    getUserDistanceToSpot(spotCoordinates, userCoordinates)
                }
            </span>
        </span>
    </li>

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
            coordsLoading: true,
            coords: null,
        };

        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.showListPage = this.showListPage.bind(this);
        this.showDetailsPage = this.showDetailsPage.bind(this);
        this.updateUserPosition = this.updateUserPosition.bind(this);
    }

    updateUserPosition(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        this.setState({ coordsLoading: false, coords: { lat, long } });
    }

    showListPage(event) {
        event.preventDefault();
        this.setState({
            activeParkingName: null,
            history: [],
            predictions: [],
        });
    }

    showDetailsPage(event, parkingName, parkingId) {
        event.preventDefault();
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
            this.setErrorMessage(<div><p><strong>Wystąpił nieoczekiwany błąd.</strong></p><p>Prosimy spróbować później.</p></div>);
        })
    }

    componentDidMount() {
        if (navigator && navigator.geolocation) {
            this.setState({ coordsLoading: true });
            navigator.geolocation.getCurrentPosition(this.updateUserPosition);
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

    getParkings() {
        return this.props.getParkings()
        .then((parkings = []) => {
            this.setState(() => ({
                parkings
            }));

            if (!parkings.length) {
              this.setErrorMessage(<div><p><strong>Brak wyników.</strong></p><p>Prosimy spróbować później.</p></div>);
              return;
            }
        }).catch(error => {
          this.setErrorMessage(<div><p><strong>Wystąpił nieoczekiwany błąd.</strong></p><p>Prosimy spróbować później.</p></div>);
        })
    }

  setErrorMessage(errorMessage) {
    this.setState({
      errorMessage
    });
  }

  renderErrorMessage() {
    const { errorMessage } = this.state;
    if (!errorMessage) {
      return null;
    }
    return (
      <div className="error" onClick={this.closeErrorMessage}>
        { errorMessage }
      </div>
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
      const lastHistoryItem = history[history.length - 1];
      return history.concat(predictions).map(({ freeSpots, time }) => ({
        freeSpots,
        time: moment(time).fromNow(),
        isFuture: lastHistoryItem && moment(time).isAfter(lastHistoryItem.time),
      }))
  }
  getBarChartWidth() {
      return window.innerWidth - 50;
  }
  getTrend() {
        const { history } = this.state;
        
        const data = history.map(({ freeSpots, time }) => ([
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
  render() {
    const { activeParkingName, coords, coordsLoading } = this.state;
    const listPageActiveClassName = !activeParkingName ? 'app-page--visible' : 'app-page--hidden';
    const detailsPageActiveClassName = activeParkingName ? 'app-page--visible' : 'app-page--hidden';
    const activeParking = this.getActiveParking();
    const activeParkingChartData = this.getActiveParkingChartData();
    return (
      <div className="app">
        <div className={`active-page ${listPageActiveClassName}`}>
            <Header />
            <Spinner className="spinner" visible={this.state.spinner}/>
            { this.renderErrorMessage() }
            <section className="app-body">
                <ul className="parkingList">
                    {this.state
                        .parkings
                        .map(({ name, freeSpots, coordinates, id }) => <Parking
                            key={id}
                            name={name}
                            spotCoordinates={coordinates}
                            userCoordinates={coords}
                            userCoordinatesLoading={coordsLoading}
                            freeSpots={freeSpots}
                            onClick={event => this.showDetailsPage(event, name, id)}
                        />)
                    }
                </ul>
            </section>
        </div>
        <ParkingDetails
            activeParking={activeParking}
            activeParkingChartData={activeParkingChartData}
            detailsPageActiveClassName={detailsPageActiveClassName}
            trend={this.getTrend()}
            backButtonHandler={this.showListPage}
        />
      </div>
    );
  }
}

App.defaultProps = {
    getParkings: () => Promise.resolve(),
    getHistory: () => Promise.resolve(),
    getPredictions: () => Promise.resolve(),
};

export default App;
