import React from 'react';
import './Header.css';

const Header = ({ backButtonVisible, backButtonHandler }) => (
    <header className="header">
        { backButtonVisible && <button className="header-backButton" onClick={backButtonHandler}>Powrót</button> }
        <h1 className="header-title">parkly</h1>
    </header>
);


export default Header;
