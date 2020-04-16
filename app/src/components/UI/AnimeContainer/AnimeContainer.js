import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AnimatedBox from '../AnimatedLoadingBox/AnimatedLoadingBox';
import PlaceHolder from '../Placeholders/MainPage';
import classes from './AnimeContainer.module.css';

const AnimeContainer = ({ title, image }) => {
  return (
    <Link to={`/show/${title}`}>
      <div className={classes.box}>
        {/* <p>{seriesDesc}</p> */}

        <>
          <img
            className={classes.image}
            src={image}
            alt={`Cover art for ${title}`}
          />
          <p className={classes.seriesName}>{title}</p>
        </>
      </div>
    </Link>
  );
};

export default AnimeContainer;
