import React from 'react';

import RatingsChart from '../RatingsChart';
import classes from './Stats.module.css';

export default function Stats({ showInfo }) {
  return (
    <div className={classes.ratingsDisplay}>
      <h1 style={{ textAlign: 'start' }}>Stats</h1>
      <div className={classes.infoContainer}>
        <div className={classes.ratings}>
          <div className={classes.score}>
            <p style={{ textAlign: 'start' }}>{showInfo.score}</p>
            <span>Average Score</span>
            <span style={{ fontSize: '0.7rem' }}>
              Rated by {showInfo['scored_by']} users
            </span>
          </div>

          <RatingsChart scores={showInfo.scores} />
        </div>
        <div className={classes.stats}>
          <div className={classes.rank}>Ranked #{showInfo['rank']}</div>
          <div>Aired {showInfo['aired']['string']} </div>
        </div>
      </div>
    </div>
  );
}
