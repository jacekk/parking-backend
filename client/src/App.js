import React, { Component } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';

const getFreeSpotsClassName = (freeSpots) => {
  let sufix;
  if (freeSpots === 0) {
    sufix = 'nospace';
  } else if (freeSpots > 0 && freeSpots <= 5) {
    sufix = 'shortage';
  } else if (freeSpots > 5 && freeSpots <= 10) {
    sufix = 'enough';
  } else if (freeSpots > 10) {
    sufix = 'good';
  }
  return `parking-spot parking-spot--${sufix}`;
}

const Parking = ({ name, freeSpots, onClick }) =>
    <li className="parkingList-item" onClick={onClick}>
        <h3 className="parking-name">{name}</h3>
        <span className="parking-data">
          <label className="parking-label">Miejsca</label> <span className={getFreeSpotsClassName(freeSpots)}>{freeSpots}</span>
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
        };

        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.showListPage = this.showListPage.bind(this);
        this.showDetailsPage = this.showDetailsPage.bind(this);
    }

    showListPage(event) {
        event.preventDefault();
        this.setState({
            activeParkingName: null,
            history: [],
            predictions: [],
        });
    }

    showDetailsPage(event, parkingName) {
        event.preventDefault();
        this.setState({
            activeParkingName: parkingName,
            spinner: true,
        });
        Promise.all([
            this.props.getHistory(parkingName),
            this.props.getPredictions(parkingName),
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
        this.getParkings();
    }

    getParkings() {
        this.props.getParkings()
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
  render() {
    const { activeParkingName } = this.state;
    const listPageActiveClassName = !activeParkingName ? 'app-page--visible' : 'app-page--hidden';
    const detailsPageActiveClassName = activeParkingName ? 'app-page--visible' : 'app-page--hidden';
    const activeParking = this.getActiveParking();

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
          }
        ]
      };

    return (
      <div className="app">
        <div className={`active-page ${listPageActiveClassName}`}>
            <header className="app-header">
                <h1 className="app-title">parkly</h1>
            </header>
            { this.renderErrorMessage() }
            <section className="app-body">
                <ul className="parkingList">
                    {this.state
                        .parkings
                        .map(({ name, freeSpots }) => <Parking
                            key={name}
                            name={name}
                            freeSpots={freeSpots}
                            onClick={event => this.showDetailsPage(event, name)}
                        />)
                    }
                </ul>
            </section>
        </div>
        <div className={`active-page ${detailsPageActiveClassName}`}>
            <header className="app-header">
                <button className="app-back" onClick={this.showListPage}>Powrót</button> <h1 className="app-title">parkly</h1>
            </header>
            <section className="app-body">
                <h3 className="parking-name">{activeParking.name}</h3>
                <span className="parking-data">
                    <label className="parking-label">Wolne miejsca obecnie</label> <span className={getFreeSpotsClassName(activeParking.freeSpots)}>{activeParking.freeSpots}</span>
                </span>
                <Bar
                    data={data}
                    width={100}
                    height={50}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </section>
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

export default App;
