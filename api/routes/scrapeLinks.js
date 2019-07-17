const express = require('express');
const router = express.Router();

const scrapeLinks = require('../controllers/scrapeLinks').scrapeLinks;

router.get('/get-links', scrapeLinks);

module.exports = router;
