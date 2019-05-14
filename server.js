const request = require('request');
// const rp = require('request-promise');
// const $ = require('cheerio');
const express = require('express');
const app = express();
//const vidPath = require('./stream');
const stream = require('./utils/torrentSetup');

const addTorrents = require('./utils/torrentSetup').addTorrent;

const getLinks = require('./api/getLinks');

app.use('/api', getLinks);

app.use(stream);

// app.use('/get-torrent', addTorrents, (req, res) => {
// 	res.send(
// 		'<body>This is an api, please visit /api to make your requests</body>'
// 	);
// });

app.listen(3000, () => console.log('Listening on PORT 3000'));
