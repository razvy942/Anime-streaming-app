import React from 'react';
import { Link } from 'react-router-dom';

import classes from './AnimeContainer.module.css';

const AnimeContainer = ({ seriesTitle, seriesImage, seriesDesc }) => {
  const img = formatImage(seriesImage);

  return (
    <Link to={`/show/${seriesTitle}`}>
      <div className={classes.box}>
        {/* <p>{seriesDesc}</p> */}
        {img ? (
          <img
            className={classes.image}
            src={img}
            alt={`Cover art for ${seriesTitle}`}
          />
        ) : (
          <p>loading</p>
        )}

        <p className={classes.seriesName}>{seriesTitle}</p>
      </div>
    </Link>
  );
};

const formatImage = (imgUrl) => {
  let url = 'https://horriblesubs.info';
  if (!imgUrl.startsWith(url)) return url + imgUrl;
  return imgUrl;
};

export default AnimeContainer;
