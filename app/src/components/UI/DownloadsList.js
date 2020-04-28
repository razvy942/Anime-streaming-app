import React from 'react';
import { ipcRenderer } from 'electron';

// receive props in the form of { name, path, downloadSpeed, progress }
const DownloadsListElement = ({ showInfo }) => {
  const removeTorrent = (torrentId) => {
    ipcRenderer.send('remove-torrent', torrentId);
  };

  const pauseTorrent = (torrentId) => {
    ipcRenderer.send('pause-torrent', torrentId);
  };

  const resumeTorrent = (torrentId) => {
    ipcRenderer.send('resume-torrent', torrentId);
  };

  return (
    <div>
      <div style={{ height: '80px' }}></div>
      {showInfo.name}: speed: {showInfo.downloadSpeed} progress:{' '}
      {showInfo.progress}
      <button onClick={() => removeTorrent(showInfo.id)}>remove</button>
      <button onClick={() => pauseTorrent(showInfo.id)}>pause</button>
      <button onClick={() => resumeTorrent(showInfo.id)}>resume</button>
    </div>
  );
};

export default DownloadsListElement;
