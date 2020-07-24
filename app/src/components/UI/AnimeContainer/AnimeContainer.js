import React from 'react';
import { Link } from 'react-router-dom';

import classes from './AnimeContainer.module.css';

const AnimeContainer = ({ info, horribleTitle }) => {
  const id = info['id'];
  console.log(id);
  const title = info['canonical_title'];
  const image = info['poster_image']['large'];
  return (
    <div className={classes.box}>
      {/* <p>{seriesDesc}</p> */}

      <Link
        to={{
          pathname: `/show/${id}`,
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
