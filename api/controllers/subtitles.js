const MatroskaSubtitles = require('matroska-subtitles');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

let client = require('../utils/client');
const clearFolder = require('../helpers/clearFolder');
const createVtt = require('../helpers/createVtt').parseVtt;
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

// TODO: check when subs are finished, then create a .vtt file
const parseSubs = file => {
	let parser = new MatroskaSubtitles();
	let magnet = client.torrents[0].magnetURI;
	let tor = client.get(magnet);
	let fl = tor.files[0];
	//let subStream = fl.createReadStream();
	parser.once('tracks', tracks => {
		console.log(tracks);
		fs.writeFileSync(
			path.join(__dirname, '..', 'helpers', 'subOut.vtt'),
			'WEBVTT\n\n'
		);
	});
	parser.on('subtitle', (sub, trackNum) => {
		//let obj = {};
		//obj[sub.time] = sub;
		//let fp = path.join('api', 'subs', 'vidsub.vtt');
		createVtt(sub);
		// fs.appendFile(fp, JSON.stringify(sub), err => {
		// 	if (err) throw err;
		// 	console.log(`subbing`);
		// });
	});

	const sub = () => {
		subStream = fl.createReadStream();
		subStream.pipe(parser);
		subStream.on('end', () => {
			console.log('DONE');
			fs.rename(
				path.join(__dirname, '..', 'helpers', 'subOut.vtt'),
				path.join(__dirname, '..', '..', 'client', 'src', 'subOut.vtt'),
				err => {
					if (err) throw `Couldn't create sub file ${err}`;
					console.log('done moving file');
				}
			);
		});
	};

	tor.ready && sub();
};
