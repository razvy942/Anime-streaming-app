const WebTorrent = require('webtorrent');
const path = require('path');
const fs = require('fs');

// to see all torrents client.torrents ..
const client = new WebTorrent();
const dirHandler = require('./seriesFolderHandle');
// let currentTorrent;

//TODO: load file path from user config file
const startDownload = (uri, seriesName, isBatch = false) => {
  // Creates appropriate directory for the series
  dirHandler.checkIfSeriesOnDisk(seriesName);

  // Check if torrent already exists
  let existingTorrent = client.get(uri);

  if (existingTorrent) {
    return true;
  }

  let currentTorrent = client.add(
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
    (torrent) => {
      console.log('hello from torrent');
      // When no corresponding torrent is found, we look for a batch and just select the appropriate episode
      if (isBatch) {
        // API buggy, need to deselect all files first, it still ends up downloading a small piece of the next file though
        torrent.deselect(0, torrent.pieces.length - 1, false);
        torrent.files.forEach((file) => {
          if (
            file.name ===
            '[bonkai77].Fate.Zero.Episode.01.(ENHANCED).Summoning.of.the.Heroes.1080p.Dual.Audio.Bluray [886DFD91].mkv'
          ) {
            file.select();
          } else {
            file.deselect();
          }
        });
      }
    }
  );

  return false;
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

const getInfo = (magnetURI, event, existingTorrent) => {
  let info = client.get(magnetURI);
  if (existingTorrent) {
    event.reply('add-torrent-reply', {
      path: info.path,
      name: info.name,
      downloadSpeed: info.downloadSpeed,
      progress: info.progress,
    });
  } else {
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
  }
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

// function testTorrentBatch() {
//   let url =
//     'magnet:?xt=urn:btih:cef3a47b73c4801e635fb0b8acc530a40b159511&dn=%5Bbonkai77%5D%20Fate%20Zero%20%28ENHANCED%29%20%5BBD-1080p%5D%20%5BDUAL-AUDIO%5D%20%20%5Bx265%5D%20%5BHEVC%5D%20%5BAAC%5D%20%5B10bit%5D&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce';
//   let currentTorrent = startDownload(url, 'Fate Zero', true);
//   currentTorrent.on('ready', () => {
//     console.log('torrent ready!!');
//   });
// }

// testTorrentBatch();

module.exports = {
  startDownload,
  removeTorrent,
  getInfo,
  getInfoAll,
};
