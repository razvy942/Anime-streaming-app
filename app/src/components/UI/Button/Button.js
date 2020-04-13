import React from 'react';

import classes from './Button.module.css';

const Button = ({ text, clickAction, isDisabled }) => {
  return (
    <div
      onClick={!isDisabled ? clickAction : undefined}
      className={
        isDisabled
          ? [classes.button, classes.disabledButton].join(' ')
          : classes.button
      }
    >
      <span>{text}</span>
    </div>
  );
};

export default Button;
