import React, { Component } from 'react';
import './App.css';

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

const Parking = ({ name, freeSpots }) =>
    <li className="parkingList-item">
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
            errorMessage: null,
        };

        this.closeErrorMessage = this.closeErrorMessage.bind(this);
    }

    componentDidMount() {
        this.getParkings();
    }

    getParkings() {
        this.props.getParkings().then((parkings = []) => {
            this.setState(() => ({
                parkings
            }))
            if (!parkings.length) {
              this.setErrorMessage(<div><p><strong>Brak wyników.</strong></p><p>Prosimy spróbować później.</p></div>);
            }
        }).catch(error => {
          this.setErrorMessage(<div><p><strong>Wystąpił nieoczekiwany błąd.</strong></p><p>Prosimy spróbować później.</p></div>);
        });
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

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">parkly</h1>
        </header>
        { this.renderErrorMessage() }
        <main className="app-body">
        <ul className="parkingList">
            {this.state
                .parkings
                .map(({ name, freeSpots }) => <Parking
                    key={name}
                    name={name}
                    freeSpots={freeSpots}
                />)
            }
        </ul>
        </main>
      </div>
    );
  }
}

export default App;
