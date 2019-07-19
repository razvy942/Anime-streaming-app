const MatroskaSubtitles = require('matroska-subtitles');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

const io = require('../utils/socket');
let client = require('../utils/client');
const clearFolder = require('../helpers/clearFolder');
const createVtt = require('../helpers/createVtt').parseVtt;
const parseSubText = require('../helpers/parseSubs').parseSubs;
let subStream = null;

module.exports.stopSub = (req, res, next) => {
	if (subStream) subStream.destroy();
	console.log('sub stoppped');
	res.json({ msg: 'sub stream killed' });
};

module.exports.getSubs = async (req, res, next) => {
	try {
		await clearFolder(path.join(__dirname, '..', 'subs'));
	} catch (error) {
		console.log(error);
	}

	setTimeout(() => {
		parseSubs();
	}, 2000);

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

	parser.once('tracks', tracks => {
		console.log(tracks);
		console.log('Sub stream started');
		// fs.writeFileSync(
		// 	path.join(__dirname, '..', 'helpers', 'subOut.vtt'),
		// 	'WEBVTT\n\n'
		// );
	});
	parser.on('subtitle', (sub, trackNum) => {
		//createVtt(sub);

		// send subs with socket in real time
		io.getIO().emit('subs', parseSubText(sub));
	});

	const sub = () => {
		subStream = fl.createReadStream();
		subStream.pipe(parser);
		subStream.on('end', () => {
			console.log('Sub stream ended');
			io.getIO().emit('done-sub', { sub: 'Finished' });
		});
	};

	tor.ready && sub();
};
