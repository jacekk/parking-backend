import React from 'react';
import './Header.css';

const Header = ({ isBackButtonVisible, backButtonHandler }) => (
    <header className="header">
        { isBackButtonVisible && <button className="header-backButton" onClick={backButtonHandler}>Powrót</button> }
        <h1 className="header-title">parkly</h1>
    </header>
);


export default Header;
