const express = require('express');
const router = express.Router();
const { logTransfer } = require('../controllers/batchController');

router.post('/transfer', logTransfer);

module.exports = router;
