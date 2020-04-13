import React from 'react';

import classes from './Synopsis.module.css';

export default function Synopsis({ showInfo, viewEpisodesAction }) {
  return (
    <div className={classes.infoContainer}>
      <div className={classes.leftView}>
        <img
          className={classes.showInfoImg}
          src={showInfo['image_url']}
          alt={`Cover art for ${showInfo.title}`}
        ></img>
        <button
          className={classes.episodesButton}
          onClick={() => viewEpisodesAction(true)}
        >{`View Episodes (${showInfo.episodes})`}</button>
      </div>
      <div className={classes.rightView}>
        <h1 className={classes.title}>{showInfo.title}</h1>
        <div className={classes.description}>{showInfo.synopsis}</div>
      </div>
    </div>
  );
}
