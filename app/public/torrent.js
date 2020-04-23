const WebTorrent = require('webtorrent');
const path = require('path');
const fs = require('fs');

// to see all torrents client.torrents ..
const client = new WebTorrent();
const dirHandler = require('./seriesFolderHandle');

const torrentQueue = [];

const magnetURI =
  'magnet:?xt=urn:btih:YZUTHBA3PH4RIVXR7WZ5DDHVOG5UNESN&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.internetwarriors.net:1337/announce&tr=udp://tracker.leechersparadise.org:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://open.stealth.si:80/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://mgtracker.org:6969/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=udp://peerfect.org:6969/announce&tr=http://share.camoe.cn:8080/announce&tr=http://t.nyaatracker.com:80/announce&tr=https://open.kickasstracker.com:443/announce';

torrentQueue.push(magnetURI);
let currentTorrent;

const startDownload = (uri, seriesName) => {
  dirHandler.checkIfSeriesOnDisk(seriesName);
  currentTorrent = client.add(
    uri,
    {
      path: path.join(
        'C:',
        'Users',
        'vanos',
        'OneDrive',
        'Desktop',
        'animetest',
        'media',
        seriesName
      ),
    },
    (torrent) => {}
  );
};

// currentTorrent.on('ready', () => {
//   console.log('torrent started download,.,.,.');
// });

// TODO: error handle
client.on('error', (err) => {
  if (err) console.log(`Error downloading torrent: ${err}`);
});

const removeTorrent = (id) => {
  // const lastTorrent = torrentQueue.pop();
  client.remove(id, (err) => {
    if (err) {
      console.log(`Error removing torrent: ${err}`);
    }
  });
};

const cleanUp = (fileName) => {
  // Remove torrent file
};

const onQuit = () =>
  client.destroy((err) => {
    if (err) {
      console.log(`Error destroying client: ${err}`);
    }
  });

const getInfo = (magnetURI, event) => {
  let info = client.get(magnetURI);
  info.on('ready', () => {
    event.reply('add-torrent-reply', {
      path: info.path,
      name: info.name,
      downloadSpeed: info.downloadSpeed,
      progress: info.progress,
    });
  });

  info.on('done', () => {
    client.remove(magnetURI, (err) => {
      if (err) {
        console.log('error removing torrent');
        return;
      }
      console.log('Removed torrent');
    });
  });
};

const getInfoAll = () => {
  const activeTorrents = client.torrents;

  console.log(`These are all the active torrents: ${activeTorrents}`);

  let info = {};
  let subInfo = {};

  for (let i = 0; i < activeTorrents.length; i++) {
    // console.log(
    //   `${activeTorrents[i]}: \n\tspeed: ${activeTorrents[i].downloadSpeed}\n\tprogress: ${activeTorrents[i].progress}`
    // );
    subInfo = {};
    subInfo.name = activeTorrents[i].name;
    subInfo.path = activeTorrents[i].path;
    subInfo.downloadSpeed = activeTorrents[i].downloadSpeed;
    subInfo.progress = activeTorrents[i].progress;
    subInfo.id = activeTorrents[i].magnetURI;

    info[activeTorrents[i].name] = subInfo;
  }

  return info;
};

module.exports = {
  startDownload,
  removeTorrent,
  getInfo,
  getInfoAll,
};
