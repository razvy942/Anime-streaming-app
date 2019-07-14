const express = require('express');
const router = express.Router();

const scrapeLinks = require('../utils/scrapeLinks').scrapeLinks;

router.get('/', (req, res) => {
	res.send('TODO: home, show info about api and the routes');
});
router.get('/get-links', scrapeLinks);

module.exports = router;
