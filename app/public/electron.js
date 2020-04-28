const path = require('path');
const { BrowserWindow, app, ipcMain, shell } = require('electron');
const { getPluginEntry } = require('mpv.js');

const isDev = require('electron-is-dev');

require('./eventChannels');

// app.asar not accessible at build, so include mpv binary inside the main dir of the app

let pluginDir;

if (isDev) {
  pluginDir = path.join(__dirname);
} else {
  pluginDir = path.join(app.getAppPath(), '..', '..');
}

// See pitfalls section for details.
if (process.platform !== 'linux') {
  process.chdir(pluginDir);
}

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch(
  'register-pepper-plugins',
  getPluginEntry(pluginDir)
);

// Needed because NaCL is deprecated in since electron 4.2.9
app.commandLine.appendSwitch('no-sandbox');

app.on('ready', () => {
  const win = new BrowserWindow({
    minWidth: 1280,
    minHeight: 1000,
    autoHideMenuBar: true,
    webPreferences: { plugins: true, nodeIntegration: true },
    frame: false,
  });
  // win.loadURL(`file://${__dirname}/index.html`);
  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.webContents.on('new-window', function (event, url) {
    event.preventDefault();
  });

  if (isDev) win.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('chg-dir', (event, arg) => {
  console.log(arg);
  console.log(app.getAppPath());
});
