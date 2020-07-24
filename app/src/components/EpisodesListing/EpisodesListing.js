import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import path from 'path';

import Hr from '../UI/HorizontalLine/HorizontalLine';
import FullscreenLoad from '../UI/Loading/FullscreenLoad';
import classes from './EpisodesLIsting.module.css';
import defaultThumbnail from '../UI/images/not-found-banner.png';
import historyCreator from '../../helpers/createaHistory';

export default function EpisodesListing({ showInfo }) {
  const [episodes, setEpisodes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentResolution, setCurrentResolution] = useState('720p');

  //const history = useHistory();
  const history = historyCreator.get();
  const location = useLocation();

  useEffect(() => {
    console.log(showInfo['title']);
    axios
      .get(`http://localhost:5000/api/get-episodes/${showInfo['kitsu_id']}`)
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
      // TODO: state does not work in hash browser, use redux for state management
      history.push('/player', { path: videoPath, epTitle: arg.name });
    });

    return () => ipcRenderer.removeAllListeners();
  }, [history, showInfo]);

  const handleDownload = (magnetURI) => {
    let title = showInfo['canonical_title'];
    if (location.state) {
      title = location.state.horribleTitle;
    }
    ipcRenderer.send('add-torrent', [magnetURI, title]);
  };

  const handleBatchDownload = () => {
    // send event with flag to let backend know that we're dealing with batch
  };

  const getEpisodeMagnet = (epNumber) => {
    let title = showInfo['title'];
    if (location.state) {
      title = location.state.horribleTitle;
    }

    epNumber = epNumber.length > 1 ? epNumber : `0${epNumber}`;

    axios
      .get(
        `http://127.0.0.1:5000/api/torrent/get-episode/${showInfo.id}/${epNumber}`
      )
      .then((res) => {
        // res is an array
        const data = res.data[showInfo.id];
        console.log(data);
        let resolutions = {
          '480p': [],
          '720p': [],
          '1080p': [],
          unknown: [],
        };

        for (let i = 0; i < data.length; i++) {
          if (
            data[i]['resolution'] === '1080p' ||
            data[i]['resolution'] === 'Bluray' ||
            data[i]['resolution'] === 'BD'
          ) {
            resolutions['1080p'].push(data[i]);
          } else if (data[i]['resolution'] === '720p') {
            resolutions['720p'].push(data[i]);
          } else if (data[i]['resolution'] === '480p') {
            resolutions['480p'].push(data[i]);
          } else {
            resolutions['unknown'].push(data[i]);
          }
        }

        console.log(resolutions);

        if (
          resolutions[currentResolution][0].episode_number === 'Batch' ||
          typeof resolutions[currentResolution][0].episode_number === 'object'
        ) {
          handleBatchDownload();
        } else {
          handleDownload(resolutions[currentResolution][0]['magnet']);
        }
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

  let coverImage = showInfo['cover_image'];
  if (coverImage['original']) {
    coverImage = coverImage['original'];
  } else {
    coverImage = defaultThumbnail;
  }
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
          <div className={classes.episodesContainer}>
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
                    onClick={() =>
                      clickHandler(episode['attributes']['number'])
                    }
                    className={classes.episodeBox}
                    key={index}
                  >
                    <div className={classes.thumbnail}>
                      <img
                        src={
                          episode['attributes']['thumbnail']
                            ? episode['attributes']['thumbnail']['original']
                            : coverImage
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
        </div>
      )}
    </>
  );
}
