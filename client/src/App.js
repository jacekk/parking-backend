import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">parkly</h1>
        </header>
        <main className="app-body">
        <ul className="parkingList">
          <li className="parkingList-item">
            <h3 className="parking-name">Galeria Dominikańska</h3>
            Wolnych miejsc: <strong className="parking-spot--good">32</strong>
          </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
            <li className="parkingList-item">
              <h3 className="parking-name">Galeria Dominikańska</h3>
              Wolnych miejsc: <strong className="parking-spot--good">32</strong>
            </li>
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
