const WebTorrent = require('webtorrent');
const path = require('path');
const client = new WebTorrent();
const router = require('express').Router();
const fs = require('fs');

// TODO: this is a dummy variable for testing only, implement dynamic magnets
const magnet =
	'magnet:?xt=urn:btih:ad4561a1a5d14a1e2b6fc88d934eab98e858c23d&dn=%5BHorribleSubs%5D%20Boku%20no%20Hero%20Academia%20-%2063%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce';

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
		progress: Math.round(client.progress * 100 * 100) / 100,
		downloadSpeed: client.downloadSpeed,
		ratio: client.ratio
	};
});

// Adding the magnet file to the download
router.get('/add/:magnet', (req, res, next) => {
	client.add(magnet, { path: path.join(__dirname + '/tmp') }, torrent => {
		let files = [];

		torrent.files.forEach(data => {
			files.push({
				name: data.name,
				length: data.length
			});
		});
		res.status(200);
		res.json(files);
	});
});

// Store the file variable here in case user refreshes page it won't give an error
let file = {};

router.get('/stream/:magnet/:file_name', (req, res, next) => {
	// let magnet = req.params.magnet;
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
