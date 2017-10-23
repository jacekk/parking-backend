import React from 'react';

import './ErrorMessage.css';

const ErrorMessage = ({ children, onClick }) => (
    <div className="error" onClick={onClick}>
        { children }
    </div>
);

export default ErrorMessage;
