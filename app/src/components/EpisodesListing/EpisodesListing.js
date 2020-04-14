import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [magnetURI, setMagnetURI] = useState(null);
  const [errors, setErrors] = useState(null);

  const history = useHistory();

  useEffect(() => {
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
      ipcRenderer.send('get-torrent-info', 'give me info');
    });

    ipcRenderer.on('get-torrent-info-reply', (event, arg) => {
      const keys = Object.keys(arg);
      // const videoPath =
      //   arg[keys[keys.length - 1]].path + '/' + arg[keys[keys.length - 1]].name;
      console.log(keys);

      console.log(arg);

      let videoPath;
      try {
        videoPath = path.join(
          arg[keys[keys.length - 1]].path,
          arg[keys[keys.length - 1]].name
        );
      } catch {
        setErrors('Couldnt obtain torrent');
        return;
      }
      console.log(videoPath);
      history.push('/player', { path: videoPath });
    });

    return () => ipcRenderer.removeAllListeners();
  }, [history, showInfo]);

  const jikanEpisodesFallback = () => {
    axios
      .get(
        `http://localhost:5000/horriblesubs/get-episodes/${showInfo['mal_id']}`
      )
      .then((res) => {
        console.log(res);
        setEpisodes(res.data);
      })
      .catch((err) => {
        // TODO: error handling
        console.log(`Error fetching episodes list`);
      });

    ipcRenderer.on('add-torrent-reply', (event, arg) => {
      ipcRenderer.send('get-torrent-info', 'give me info');
    });
  };

  const parseDate = (dateValue) => {
    const date = Date(dateValue);
    // TODO: Later
  };

  const handleDownload = (magnetURI) => {
    ipcRenderer.send('add-torrent', [magnetURI, showInfo['title']]);
  };

  const getEpisodeMagnet = (epNumber) => {
    const title = showInfo['title'];

    axios
      .get(
        `http://127.0.0.1:5000/horriblesubs/get-episode/${title}/${epNumber}`
      )
      .then((res) => {
        const uri = res.data;
        let resolution = {};
        uri.forEach((show) => {
          Object.keys(show).forEach((key) => {
            resolution['720p'] = show[key]['720p'];
            resolution['1080p'] = show[key]['1080p'];
          });
        });

        if (
          resolution['720p'] === undefined &&
          resolution['1080p'] === undefined
        ) {
          setMagnetURI(null);
        }
        // setMagnetURI(resolution);
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
      {errors ? (
        <h1>error oops</h1>
      ) : (
        <div className={classes.container}>
          {episodes ? (
            episodes.map((episode, index) => (
              <>
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
              </>
            ))
          ) : (
            <p>loading</p>
          )}
        </div>
      )}
    </>
  );
}
