const express = require('express');
const sitesController = require('../controllers/sites.controller');

const router = express.Router();

router.post('/', sitesController.createSite);
router.get('/', sitesController.getSites);
router.get('/:id/metrics', sitesController.getSiteMetrics);

module.exports = router;