const path = require('path');
const magnetURI = require('magnet-uri');
const parseRange = require('range-parser');

const clearFolder = require('../helpers/clearFolder');
let client = require('../utils/client');
let magnet = undefined;
let stream = null;

let stats = {
	progress: 0,
	downloadSpeed: 0,
	ratio: 0
};

client.on('error', err => {
	console.log(err.message);
});

client.on('download', bytes => {
	stats = {
		progress: client.progress,
		downloadSpeed: client.downloadSpeed,
		ratio: client.ratio
	};
});

client.once('download', bytes => {
	console.log('started download');
	const tor = client.get(magnet);
});

module.exports.killStream = (req, res, next) => {
	if (stream) stream.destroy();
	console.log('video stream stoppped');
	next();
};

module.exports.addToDownload = async (req, res, next) => {
	if (magnet != undefined) {
		client.remove(magnet);
	}

	magnet = magnetURI.encode(req.query);

	try {
		await clearFolder(path.join(__dirname, '..', 'utils', 'tmp'));
	} catch (err) {
		console.log(err);
		//throw err;
	}
	client.add(
		magnet,
		{ path: path.join(__dirname, '..', 'utils', 'tmp') },
		torrent => {
			let files = [];

			torrent.files.forEach(data => {
				files.push({
					name: data.name,
					length: data.length
				});
			});

			const tor = client.get(magnet);

			res.status(200);
			res.json(files);
		}
	);
};

module.exports.streamFile = (req, res, next) => {
	const tor = client.get(magnet);
	//const filePath = path.join(__dirname, 'tmp', tor.files[0].path);
	const size = tor.files[0].length;

	// Support range-requests
	res.setHeader('Content-Type', 'video/webm');
	res.setHeader('Accept-Ranges', 'bytes');

	// Support DLNA streaming
	res.setHeader('transferMode.dlna.org', 'Streaming');
	res.setHeader(
		'contentFeatures.dlna.org',
		'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
	);

	let range = parseRange(size, req.headers.range || '');
	if (Array.isArray(range)) {
		range = range[0];

		res.statusCode = 206;

		res.setHeader('Content-Length', range.end - range.start + 1);
		res.setHeader(
			'Content-Range',
			`bytes ${range.start}-${range.end}/${size}`
		);
		res.setHeader('Keep-Alive', '6000');
	} else {
		// Here range is either -1 or -2
		res.setHeader('Content-Length', size);
		range = null;
	}

	stream = tor.files[0].createReadStream(range);
	const close = () => {
		// when fast-forwarding
		if (stream) {
			stream.destroy();
		}
	};

	res.once('close', close);
	res.once('error', close);
	res.once('finish', close);

	stream.pipe(res);
};

module.exports.getStats = (req, res, next) => {
	res.status(200);
	res.json(stats);
};
