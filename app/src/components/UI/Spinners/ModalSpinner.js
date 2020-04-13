import React from 'react';

import classes from './ModalSpinner.module.css';

export default function ModalSpinner() {
  return (
    <div className={classes.container}>
      <div className={classes.loader}>Loading...</div>
    </div>
  );
}
