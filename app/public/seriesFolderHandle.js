const path = require('path');
const fs = require('fs');

// media folder should be read from a custom user config file, assume it's ./media for now
const checkIfSeriesOnDisk = (seriesName) => {
  // const seriesPath = path.join(__dirname, 'media', seriesName);
  // TODO: Load path from user config file
  const seriesPath = path.join(
    'C:',
    'Users',
    'vanos',
    'OneDrive',
    'Desktop',
    'animetest',
    'media',
    seriesName
  );

  if (fs.existsSync(seriesPath)) {
    return true;
  } else {
    fs.mkdirSync(seriesPath);
    return true;
  }
};

const isFileAlreadyDownloaded = (seriesName, fileName) => {
  const seriesPath = path.join(__dirname, 'media', seriesName, fileName);
  return fs.existsSync(seriesPath);
};

module.exports = {
  checkIfSeriesOnDisk,
  isFileAlreadyDownloaded,
};
