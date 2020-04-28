import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

import classes from './DownloadsList.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPause, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';

// receive props in the form of { name, path, downloadSpeed, progress }
const DownloadsListElement = ({ showInfo }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const removeTorrent = (torrentId) => {
    ipcRenderer.send('remove-torrent', torrentId);
  };

  const pauseTorrent = (torrentId) => {
    ipcRenderer.send('pause-torrent', torrentId);
  };

  const resumeTorrent = (torrentId) => {
    // TODO: check if torrent is downloading or not
    ipcRenderer.send('resume-torrent', torrentId);
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div>
      <div className={classes.tblContent}>
        <table cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            <tr>
              <td>{showInfo.name}</td>
              <td>{formatBytes(showInfo.downloadSpeed)}/s</td>
              <td>{(parseFloat(showInfo.progress) * 100).toFixed(2)}%</td>
              <td>
                <button
                  className={classes.actionBtn}
                  onClick={() => resumeTorrent(showInfo.id)}
                >
                  <FontAwesomeIcon
                    size="md"
                    icon={isDownloading ? faPause : faPlay}
                  />
                </button>
                <button
                  className={classes.actionBtn}
                  onClick={() => removeTorrent(showInfo.id)}
                >
                  <FontAwesomeIcon size="md" icon={faTimes} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadsListElement;
