const router = require('express').Router();
const subtitlesController = require('../controllers/subtitles');

router.get('/stop-subs', subtitlesController.stopSub);
router.get('/get-subs', subtitlesController.getSubs);
router.get('/is-file-ready', subtitlesController.isFileReady);
router.get('/get-track/:time', subtitlesController.getTrackInfo);

module.exports = router;
