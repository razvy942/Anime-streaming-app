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
  return new Promise((resolve, reject) => {
    console.log('hello from torrent');
    dirHandler.checkIfSeriesOnDisk(seriesName);
    currentTorrent = client.add(
      uri,
      { path: path.join(__dirname, 'media', seriesName) },
      (torrent) => {
        console.log('client is downloading');

        torrent.files.forEach((file) => {
          //console.log(file);

          console.log(file.name);
          console.log(file.path);
          console.log('is ready: ' + file.ready);
        });
      }
    );

    resolve('torrent was added');
  });
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

const getInfo = () => {
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
};
