const WebTorrent = require('webtorrent');
const path = require('path');
const router = require('express').Router();
const magnetURI = require('magnet-uri');
const fs = require('fs');
const MatroskaSubtitles = require('matroska-subtitles');

const exec = require('child_process').exec;

const client = new WebTorrent();
let parser = new MatroskaSubtitles();
// global variable to hold magnet info
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

	// deleting previous files
	fs.readdir(path.join(__dirname + '/tmp'), (err, data) => {
		// console.log(data);
		for (let i = 0; i < data.length; i++) {
			if (data[i].startsWith('[')) {
				fs.unlink(path.join(__dirname + '/tmp/' + data[i]), err => {
					console.log(err);
				});
			}
		}

		//console.log(magnet);
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
});

// Store the file variable here in case user refreshes page it won't give an error

router.get('/stream/:file_name', (req, res, next) => {
	let file = null;
	var tor = client.get(magnet);

	if (tor) {
		for (i = 0; i < tor.files.length; i++) {
			// Validate the file with the req.params.file_name to add the right file to the file object
			//if (tor.files[i].name == req.params.file_name) {
			//if (new RegExp(req.params.file_name).test(tor.files[i].name)) {
			file = tor.files[i];
			// } else {
			// 	res.json({
			// 		error: 'Invalid file name'
			// 	});
			// }
		}
	} else {
		fs.readdir(path.join(__dirname + '/tmp'), (err, data) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].startsWith('[')) {
					file = data[i];
					break;
				}
			}
		});
	}
	//console.log(file);
	//if (file.path) {
	let dirPath = path.join(__dirname, '..', 'client', 'src', 'components');

	let filePath = path.join(__dirname + '/tmp/' + file.path);

	//}

	let range = req.headers.range;

	// console.log(range);

	//  Browser doesn't ask for range during first request,
	//  Just set it to 0
	if (!range) {
		range = `0-${file.length}`;
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
	// if (stream) {
	// 	parseSubs(stream_position.end, file, parser);
	// }
});

router.get('/stats', (req, res, next) => {
	res.status(200);
	res.json(stats);
});

// async function parseSubsAsync(start, fp) {
// 	var parser = new MatroskaSubtitles();

// 	// first an array of subtitle track information is emitted
// 	parser.once('tracks', function(tracks) {
// 		console.log(tracks);
// 	});

// 	// afterwards each subtitle is emitted
// 	parser.on('subtitle', function(subtitle, trackNumber) {
// 		console.log('Track ' + trackNumber + ':', subtitle);
// 	});
// 	await fp.createReadStream().pipe(parser);
// }

// const parseSubs = (start, fp) => {
// 	var parser = new MatroskaSubtitles();

// 	// first an array of subtitle track information is emitted
// 	parser.once('tracks', function(tracks) {
// 		console.log(tracks);
// 	});

// 	// afterwards each subtitle is emitted
// 	parser.on('subtitle', function(subtitle, trackNumber) {
// 		console.log('Track ' + trackNumber + ':', subtitle);
// 	});
// 	fp.createReadStream().pipe(parser);
// };

module.exports = router;
