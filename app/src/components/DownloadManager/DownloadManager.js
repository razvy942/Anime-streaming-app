import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import DownloadsListElement from '../UI/DownloadsList';
import classes from './DownloadManager.module.css';

const DownloadManager = () => {
  const [torrentList, setTorrentList] = useState(null);

  // Send message to fetch list of torrents upon being mounted
  useEffect(() => {
    ipcRenderer.send('get-torrent-info', 'give me info');
    // Request torrent info every second to update on front-end
    let interval = setInterval(() => {
      ipcRenderer.send('get-torrent-info', 'give me info');
    }, 300);
    // remove interval when component gets unmounted
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('im updating');

    ipcRenderer.on('get-torrent-info-reply', (event, arg) => {
      console.log(arg);
      setTorrentList(arg);
    });

    ipcRenderer.on('torrent-added', (event, arg) => {
      console.log(arg);
    });

    return () => ipcRenderer.removeAllListeners();
  }, [torrentList]);

  return (
    <div className={classes.torrentTable}>
      {torrentList ? (
        <div>
          {Object.keys(torrentList).map((show, index) => (
            <DownloadsListElement showInfo={torrentList[show]} />
          ))}
        </div>
      ) : (
        <div>Nothing downloading right now</div>
      )}
    </div>
  );
};

export default DownloadManager;
