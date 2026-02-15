const express = require('express');
const ingestController = require('../controllers/ingest.controller');
const validate = require('../middlewares/validation.middleware');
const { ingestBatchSchema } = require('../validation/schemas');

const router = express.Router();

router.post('/', validate(ingestBatchSchema, 'body'), ingestController.ingest);

module.exports = router;