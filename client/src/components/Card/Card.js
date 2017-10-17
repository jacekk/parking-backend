import React from 'react';
import cn from 'classnames';

import './Card.css';

const Card = ({ children, label, className }) => (
    <span className={cn('card', className)}>
        {label && <label className="card-label">
                {label}
            </label>
        }
        <span className="card-value">
            {children}
        </span>
    </span>
);

export default Card;
