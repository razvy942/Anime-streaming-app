const MatroskaSubtitles = require('matroska-subtitles');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

let client = require('../utils/client');
const clearFolder = require('../helpers/clearFolder');
let subStream = null;

module.exports.stopSub = (req, res, next) => {
	if (subStream) subStream.destroy();
	console.log('sub stoppped');
	next();
};

module.exports.getSubs = async (req, res, next) => {
	try {
		await clearFolder(path.join(__dirname, '..', 'subs'));
	} catch (error) {
		console.log(error);
	}
	fs.readdir(path.join(__dirname, '..', 'utils', 'tmp'), (err, data) => {
		if (err) throw err;
		if (data.length === 0) return; //throw "No video file exists (substitles.js)";
		setTimeout(() => {
			parseSubs(path.join(__dirname, '..', 'utils', 'tmp', data[0]));
		}, 3000);
	});
	res.json({ msg: 'Subbing started' });
};

module.exports.isFileReady = (req, res, next) => {
	let magnet = client.torrents[0].magnetURI;
	let tor = client.get(magnet);
	let ready = tor.progress > 0.01;
	res.json({
		ready: ready
	});
};

module.exports.getTrackInfo = (req, res, next) => {
	let sub = [];

	fs.readdir(path.join(__dirname, '..', '..', 'subs'), (err, data) => {
		if (err) throw err;
		data.forEach(file => {
			let subdata = fs.readFileSync(
				path.join(__dirname, '..', '..', 'subs', file)
			);
			try {
				sub.push(JSON.parse(subdata));
			} catch (err) {
				console.log(`couldnt parse sub ${err}`);
			}
		});
		res.json({ subtitle: sub });
	});
};

const parseSubs = file => {
	let parser = new MatroskaSubtitles();
	let magnet = client.torrents[0].magnetURI;
	let tor = client.get(magnet);
	let fl = tor.files[0];
	//let subStream = fl.createReadStream();
	parser.once('tracks', tracks => {
		console.log(tracks);
	});
	parser.on('subtitle', (sub, trackNum) => {
		let obj = {};
		obj[sub.time] = sub;

		fs.writeFile(`subs\\${sub.time}.json`, JSON.stringify(obj), err => {
			if (err) throw err;
			console.log(`subbing`);
		});
	});

	const sub = () => {
		subStream = fl.createReadStream();
		subStream.pipe(parser);
	};

	tor.ready && sub();
};
