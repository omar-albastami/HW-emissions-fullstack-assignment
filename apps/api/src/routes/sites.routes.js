const express = require('express');
const sitesController = require('../controllers/sites.controller');

const router = express.Router();

router.post('/', sitesController.createSite);

module.exports = router;