const WebTorrent = require('webtorrent');
const path = require('path');
const router = require('express').Router();
const magnetURI = require('magnet-uri');
const fs = require('fs');

const client = new WebTorrent();

// TODO: this is a dummy variable for testing only, implement dynamic magnets
let magnet;

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

let previousTorrent = {};

// Adding the magnet file to the download
router.get('/add/*', (req, res, next) => {
	magnet = magnetURI.encode(req.query);

	// cleaning up torrent downloads
	for (let tor in previousTorrent) {
		client.remove(previousTorrent[tor], data =>
			console.log('deteleted torrent')
		);
		delete tor;
	}

	console.log(magnet);
	client.add(magnet, { path: path.join(__dirname + '/tmp') }, torrent => {
		let files = [];

		torrent.files.forEach(data => {
			files.push({
				name: data.name,
				length: data.length
			});
		});
		previousTorrent.torID = magnet;
		res.status(200);
		res.json(files);
	});
});

// Store the file variable here in case user refreshes page it won't give an error

router.get('/stream/:file_name', (req, res, next) => {
	let file = {};
	var tor = client.get(magnet);

	for (i = 0; i < tor.files.length; i++) {
		// TODO: validate the file with the req.params.file_name to add the right file to the file object
		// if (tor.files[i].name == req.params.file_name) {
		file = tor.files[i];
		//}
	}

	let range = req.headers.range;

	console.log(range);

	//  Browser doesn't ask for range during first request,
	//  Just set it to 0
	if (!range) {
		range = '0';
	}

	let positions = range.replace(/bytes=/, '').split('-');
	let start = parseInt(positions[0], 10);

	let file_size = file.length;
	let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
	let chunksize = end - start + 1;
	let head = {
		'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': 'video/mp4'
	};

	// Status code 206 refers to partial content, we are streaming the file in chunks
	res.writeHead(206, head);

	let stream_position = {
		start: start,
		end: end
	};
	let stream = file.createReadStream(stream_position);
	console.log(stream);
	stream.pipe(res);

	//	If there was an error while opening a stream we stop the
	//	request and display it.
	stream.on('error', function(err) {
		return next(err);
	});
});

router.get('/stats', (req, res, next) => {
	res.status(200);
	res.json(stats);
});

module.exports = router;
