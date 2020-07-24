const path = require('path');
const { BrowserWindow, app, ipcMain, shell, screen } = require('electron');

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
  process.platform === 'darwin'
    ? getPluginEntry(pluginDir, 'mpvjs.mac.node')
    : getPluginEntry(pluginDir)
);

// Needed because NaCL is deprecated in since electron 4.2.9
app.commandLine.appendSwitch('no-sandbox');

app.on('ready', () => {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    y: 0,
    x: width - 1000,
    autoHideMenuBar: true,
    webPreferences: { plugins: true, nodeIntegration: true },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.webContents.on('new-window', function (event, url) {
    event.preventDefault();
  });

  win.setAlwaysOnTop(true, 'floating', 1);
  win.setVisibleOnAllWorkspaces(true);

  if (isDev) win.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('chg-dir', (event, arg) => {
  console.log(arg);
  console.log(app.getAppPath());
});

function getPluginEntry(pluginDir, pluginName = 'mpvjs.node') {
  const PLUGIN_MIME_TYPE = 'application/x-mpvjs';
  const fullPluginPath = path.join(pluginDir, pluginName);
  // Try relative path to workaround ASCII-only path restriction.
  let pluginPath = path.relative(process.cwd(), fullPluginPath);
  if (path.dirname(pluginPath) === '.') {
    // "./plugin" is required only on Linux.
    if (process.platform === 'linux') {
      pluginPath = `.${path.sep}${pluginPath}`;
    }
  } else {
    // Relative plugin paths doesn't work reliably on Windows, see
    // <https://github.com/Kagami/mpv.js/issues/9>.
    if (process.platform === 'win32') {
      pluginPath = fullPluginPath;
    }
  }

  return `${pluginPath};${PLUGIN_MIME_TYPE}`;
}
