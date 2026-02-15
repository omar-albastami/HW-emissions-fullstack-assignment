const express = require('express');
const sitesController = require('../controllers/sites.controller');
const validate = require('../middlewares/validation.middleware');
const { createSiteSchema, uuidParamSchema } = require('../validation/schemas');

const router = express.Router();

router.post('/', validate(createSiteSchema, 'body'), sitesController.createSite);
router.get('/', sitesController.getSites);
router.get('/:id/metrics', validate(uuidParamSchema, 'params.id'), sitesController.getSiteMetrics);

module.exports = router;