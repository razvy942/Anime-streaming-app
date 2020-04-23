import React from 'react';

import classes from './MainPage.module.css';

export default function MainPage({ components }) {
  const elems = [];

  // 15 elements shown per page
  for (let i = 0; i < components; i++) {
    elems.push(
      <div key={i}>
        <div className={classes.animeBoxPlaceholder}></div>
        <p className={classes.textPlaceholder}></p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px',
      }}
    >
      {elems}
    </div>
  );
}
