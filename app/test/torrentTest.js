const expect = require('chai').expect;

const torrent = require('../public/torrent');

it('should donwnload only specified file', () => {
  let torrentInfo = torrent.startDownload('uri', 'name', true);
  torrentInfo.on('ready', () => {
    expect(torrent.client.torrents[0].files.length).to.equal(1);
  });
});
