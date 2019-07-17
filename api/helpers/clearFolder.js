const fs = require('fs');
const path = require('path');

/** @description Deletes contents of folder */
const clearFolder = filePath => {
	return new Promise((resolve, error) => {
		fs.readdir(filePath, (err, data) => {
			if (data.length == 0) resolve();
			if (err) {
				console.log(`Couldn't read directory ${err}`);
				error('Error opening temp folder');
			}
			for (let i = 0; i < data.length; i++) {
				fs.unlink(path.join(filePath, data[i]), err => {
					if (err) {
						error('Error clearing temp folder');
					}
					resolve('tmp was cleared');
				});
			}
		});
	});
};

module.exports = clearFolder;
