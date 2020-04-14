import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import classes from './AnimeContainer.module.css';

const baseURL = 'https://kitsu.io/api/edge/';

const AnimeContainer = ({ seriesTitle, seriesImage, seriesDesc }) => {
  const [showInfo, setShowInfo] = useState(null);

  useEffect(() => {
    const searchTerm = `anime?filter[text]=${seriesTitle}`;
    console.log('loading');
    axios
      .get(baseURL + searchTerm)
      .then((res) => {
        //console.log(res.data);
        let info = res['data']['data'][0];

        console.log(res['data']['data'][0]);
        // console.log(res.data['attributes']);
        setShowInfo(info['attributes']);
      })
      .catch((err) => console.log('error getting main page info'));
  }, []);

  return (
    <Link to={`/show/${seriesTitle}`}>
      <div className={classes.box}>
        {/* <p>{seriesDesc}</p> */}
        {showInfo ? (
          <>
            <img
              className={classes.image}
              src={showInfo && showInfo['posterImage']['medium']}
              alt={`Cover art for ${seriesTitle}`}
            />
            <p className={classes.seriesName}>{seriesTitle}</p>
          </>
        ) : (
          <div className={classes.loadingBox}>
            <div className={classes.animatedBar}></div>
          </div>
        )}
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
