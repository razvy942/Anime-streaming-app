import React from 'react';

import classes from './Synopsis.module.css';

export default function Synopsis({ showInfo, viewEpisodesAction }) {
  return (
    <div className={classes.infoContainer}>
      <div className={classes.leftView}>
        <img
          className={classes.showInfoImg}
          src={showInfo['poster_image']['large']}
          alt={`Cover art for ${showInfo['canonical_title']}`}
        ></img>
        <button
          className={classes.episodesButton}
          onClick={() => viewEpisodesAction(true)}
        >{`View Episodes (${showInfo['attributes']['episode_count']})`}</button>
      </div>
      <div className={classes.rightView}>
        <h1 className={classes.title}>{showInfo['canonical_title']}</h1>
        <div className={classes.description}>
          {showInfo['attributes']['synopsis']}
        </div>
      </div>
    </div>
  );
}
