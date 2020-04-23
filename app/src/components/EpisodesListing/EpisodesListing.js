import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import path from 'path';

import Hr from '../UI/HorizontalLine/HorizontalLine';
import FullscreenLoad from '../UI/Loading/FullscreenLoad';
import classes from './EpisodesLIsting.module.css';
import defaultThumbnail from '../UI/images/not-found-banner.png';

export default function EpisodesListing({ showInfo }) {
  const [episodes, setEpisodes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentResolution, setCurrentResolution] = useState('720p');

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    console.log(showInfo['title']);
    axios
      .get(`http://localhost:5000/horriblesubs/get-episodes`)
      .then((res) => {
        console.log(res.data.data);
        setEpisodes(res.data.data);
      })
      .catch((err) => {
        // TODO: error handling
        console.log(`Error fetching episodes list`);
      });

    ipcRenderer.on('add-torrent-reply', (event, arg) => {
      let videoPath;
      try {
        videoPath = path.join(arg.path, arg.name);
      } catch {
        setErrors('Couldnt obtain torrent');
        return;
      }
      history.push('/player', { path: videoPath });
    });

    return () => ipcRenderer.removeAllListeners();
  }, [history, showInfo]);

  const handleDownload = (magnetURI) => {
    let title = showInfo['title'];
    if (location.state) {
      title = location.state.horribleTitle;
    }
    ipcRenderer.send('add-torrent', [magnetURI, title]);
  };

  const getEpisodeMagnet = (epNumber) => {
    let title = showInfo['title'];
    if (location.state) {
      title = location.state.horribleTitle;
    }

    axios
      .get(
        `http://127.0.0.1:5000/horriblesubs/get-episode/${title}/${epNumber}`
      )
      .then((res) => {
        const data = res.data;
        console.log(data);
        let resolution = {};

        resolution['720p'] = data[title]['720p'];
        resolution['1080p'] = data[title]['1080p'];
        if (
          resolution['720p'] === undefined &&
          resolution['1080p'] === undefined
        ) {
          // handle errors
        }
        console.log(resolution);

        handleDownload(resolution['720p']);
        console.log(resolution);
      })
      .catch((err) => {
        console.log(`Error fetching ${title}'s details: ${err}`);
        // setError(true);
      });
  };

  const clickHandler = (epNumber) => {
    if (!isLoading) {
      getEpisodeMagnet(epNumber);
    }
    setIsLoading(!isLoading);
  };

  // [{ attributes: { airdate, canonicalTitle, number, synopsis, thumbnail: { original } } }]
  return (
    <>
      <select
        value={currentResolution}
        onChange={(e) => setCurrentResolution(e.target.value)}
        id="resolution"
      >
        <option value="480p">480p</option>
        <option value="720p">720p</option>
        <option value="1080p">1080p</option>
      </select>
      {errors ? (
        <h1>error oops</h1>
      ) : (
        <div className={classes.container}>
          {episodes ? (
            episodes.map((episode, index) => (
              <div key={index}>
                {isLoading && (
                  <FullscreenLoad
                    message="Fetching torrent link please wait..."
                    handleHide={() => setIsLoading(false)}
                  />
                )}
                <div
                  onClick={() => clickHandler(episode['attributes']['number'])}
                  className={classes.episodeBox}
                  key={index}
                >
                  <div className={classes.thumbnail}>
                    <img
                      src={
                        episode['attributes']['thumbnail']
                          ? episode['attributes']['thumbnail']['original']
                          : defaultThumbnail
                      }
                      alt={`Episode ${episode['attributes']['number']} thumbnail`}
                    />
                  </div>
                  <div className={classes.epInfo}>
                    <span className={classes.title}>
                      {episode['attributes']['number']}:{' '}
                      {episode['attributes']['canonicalTitle']}
                    </span>
                    <div className={classes.synopsis}>
                      {episode['attributes']['synopsis']}
                    </div>
                    {'...'}
                    <span className={classes.airDate}>
                      Aired on {episode['attributes']['airdate']}
                    </span>
                  </div>
                </div>
                <Hr />
              </div>
            ))
          ) : (
            <p>loading</p>
          )}
        </div>
      )}
    </>
  );
}
