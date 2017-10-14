import React, { Component } from 'react';
import './App.css';

const getFreeSpotsClassName = (freeSpaces) => {
  let sufix;
  if (freeSpaces === 0) {
    sufix = 'nospace';
  } else if (freeSpaces > 0 && freeSpaces <= 5) {
    sufix = 'shortage';
  } else if (freeSpaces > 5 && freeSpaces <= 10) {
    sufix = 'enough';
  } else if (freeSpaces > 10) {
    sufix = 'good';
  }
  return `parking-spot parking-spot--${sufix}`;
}

const Parking = ({ name, freeSpaces }) =>
    <li className="parkingList-item">
        <h3 className="parking-name">{name}</h3>
        <span className="parking-data">
          <label className="parking-label">Wolnych miejsc</label> <span className={getFreeSpotsClassName(freeSpaces)}>{freeSpaces}</span>
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
        // this.getParkings();
    }

    getParkings() {
        this.props.getParkings().then(parkings => {
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
            {this.state.parkings.map(({name, freeSpaces}) => <Parking key={name} name={name} freeSpaces={freeSpaces} />)}
            <Parking key="galeria" name="Galeria Dominikanska" freeSpaces={20} />
        </ul>
        </main>
      </div>
    );
  }
}

export default App;
