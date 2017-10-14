import React, { Component } from 'react';
import './App.css';

const getFreePlacesClassName = (freePlaces) => {
  let sufix;
  if (freePlaces === 0) {
    sufix = 'nospace';
  } else if (freePlaces > 0 && freePlaces <= 5) {
    sufix = 'shortage';
  } else if (freePlaces > 5 && freePlaces <= 10) {
    sufix = 'enough';
  } else if (freePlaces > 10) {
    sufix = 'good';
  }
  return `parking-spot parking-spot--${sufix}`;
}

const Parking = ({ name, freePlaces }) =>
    <li className="parkingList-item">
        <h3 className="parking-name">{name}</h3>
        <span className="parking-data">
          <label className="parking-label">Wolnych miejsc</label> <span className={getFreePlacesClassName(freePlaces)}>{freePlaces}</span>
        </span>
    </li>


class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            parkings: []
        }
    }

    componentDidMount() {
        this.getParkings();
    }

    getParkings() {
        this.props.getParkings().then((parkings = []) => {
            this.setState(() => ({
                parkings
            }))
        });
    }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">parkly</h1>
        </header>
        <main className="app-body">
        <ul className="parkingList">
            {this.state.parkings.map(({name, freePlaces}) => <Parking key={name} name={name} freePlaces={freePlaces} />)}
        </ul>
        </main>
      </div>
    );
  }
}

export default App;
