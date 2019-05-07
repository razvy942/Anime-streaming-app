const request = require('request');
// const rp = require('request-promise');
// const $ = require('cheerio');
const express = require('express');
const app = express();

const getLinks = require('./api/getLinks');

app.use('/api', getLinks);
app.use('', (req, res) => {
    res.send(
        '<h1>This is an api, please visit /api to make your requests</h1>'
    );
});

app.listen(3000, () => console.log('Listening on PORT 3000'));
