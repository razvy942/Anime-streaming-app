const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const stream = require('./routes/torrentStream');
const subs = require('./routes/subtitles');
const getLinks = require('./api/getLinks');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(stream);
app.use('/api', getLinks);
app.use(subs);

app.listen(5000, () => console.log('Server listening on PORT 5000'));
