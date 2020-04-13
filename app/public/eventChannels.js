const { ipcMain } = require('electron');
const torrent = require('./torrent');

ipcMain.on('add-torrent', (event, arg) => {
  console.log('hello i am adding new torrent: ' + arg[0]);
  torrent.startDownload(arg[0], arg[1]);
  event.reply('add-torrent-reply', 'TORRENT ADDED!!!!');
});

ipcMain.on('remove-torrent', (event, arg) => {
  console.log(`Removed torrent`);
  torrent.removeTorrent(arg);
});

ipcMain.on('pause-torrent', (event, arg) => {
  console.log(`TODO`);
});

ipcMain.on('resume-torrent', (event, arg) => {
  console.log(`TODO`);
});

ipcMain.on('get-torrent-info', (event, arg) => {
  const info = torrent.getInfo();
  event.reply('get-torrent-info-reply', info);
});
