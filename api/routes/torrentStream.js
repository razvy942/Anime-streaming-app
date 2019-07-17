const router = require('express').Router();
const torrentStreamController = require('../controllers/torrentStream');

router.get('/kill-stream', torrentStreamController.killStream);
router.get('/add/*', torrentStreamController.addToDownload);
router.get('/stream/:file_name', torrentStreamController.streamFile);
router.get('/stats', torrentStreamController.getStats);

module.exports = router;
