import React from 'react';

const Header = ({ backButtonVisible, backButtonHandler }) => (
    <header className="app-header">
        { backButtonVisible && <button className="app-back" onClick={backButtonHandler}>Powrót</button> }
        <h1 className="app-title">parkly</h1>
    </header>
);

export default Header;
