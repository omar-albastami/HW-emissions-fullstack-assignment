const express = require('express');
const ingestController = require('../controllers/ingest.controller');

const router = express.Router();

router.post('/', ingestController.ingest);

module.exports = router;