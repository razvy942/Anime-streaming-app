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
            <p style={{ textAlign: 'start', marginBottom: '20px' }}>
              {showInfo['attributes']['rating']}
            </p>
            <span>Average Score</span>
            {/* <span style={{ fontSize: '0.7rem' }}>
              Rated by {showInfo['scored_by']} users
            </span> */}
          </div>

          {/* <RatingsChart scores={showInfo.scores} /> */}
        </div>
        <div className={classes.stats}>
          <div className={classes.rank}>
            Ranked #{showInfo['attributes']['rating_rank']}
          </div>
          <div>Aired {showInfo['attributes']['start_date']} </div>
        </div>
      </div>
    </div>
  );
}
