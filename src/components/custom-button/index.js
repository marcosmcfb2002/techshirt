import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CustomButton = ({ children, onClick, ...props }) => {
    return (
        <Button
            style={{ backgroundColor: '#207869', borderColor: '#207869', color: 'white' }}
            onClick={onClick}
            {...props}
        >
            {children}
        </Button>
    );
};

CustomButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

export default CustomButton;
