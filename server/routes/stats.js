const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/stats');

router.route('/').get(getStats);

module.exports = router;


