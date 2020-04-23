import React from 'react';
import { Link } from 'react-router-dom';

import classes from './AnimeContainer.module.css';

const AnimeContainer = ({ info, horribleTitle }) => {
  const { title, image } = info;
  return (
    <div className={classes.box}>
      {/* <p>{seriesDesc}</p> */}

      <Link
        to={{
          pathname: `/show/${encodeURIComponent(title)}`,
          state: {
            horribleTitle: horribleTitle,
          },
        }}
      >
        <img
          className={classes.image}
          src={image}
          alt={`Cover art for ${title}`}
        />
      </Link>

      <div className={classes.seriesName}>{title}</div>
    </div>
  );
};

export default AnimeContainer;
