import React, { Component } from 'react';
import './App.css';

const Parking = ({ name, freeSpaces }) => 
    <li className="parkingList-item">
        <h3 className="parking-name">{name}</h3>
        Wolnych miejsc: <strong className="parking-spot--good">{freeSpaces}</strong>
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
        </ul>
        </main>
      </div>
    );
  }
}

export default App;
