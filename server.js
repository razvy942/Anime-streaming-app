const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const stream = require('./api/routes/torrentStream');
const subs = require('./api/routes/subtitles');
const scrapeLinks = require('./api/routes/scrapeLinks');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', stream);
app.use('/api', scrapeLinks);
app.use('/api', subs);

app.listen(5000, () => console.log('Server listening on PORT 5000'));
