const AppError = require('../utils/AppError');
const codes = require('../constants/codes');
const ingestService = require('../services/ingest.service');
const utils = require('../utils');

const ingest = async (req, res, next) => {
    try {
        const { batch_id, site_id, measurements } = req.body;

        if (utils.isNullOrUndefined(batch_id)) {
            throw new AppError (req.id, `Missing required 'batch_id' field`, codes.REQUIRED_FIELD, 400, false);
        };
        if (utils.isNullOrUndefined(site_id)) {
            throw new AppError (req.id, `Missing required 'site_id' field`, codes.REQUIRED_FIELD, 400, false);
        };
        if (utils.isNullOrUndefined(measurements)) {
            throw new AppError (req.id, `Missing required 'measurements' field`, codes.REQUIRED_FIELD, 400, false);
        };
        if (!Array.isArray(measurements) || measurements.length === 0 || measurements.length > 100) {
            throw new AppError (req.id, `The value of 'measurements' should be an array between 1 - 100 measurements`, codes.INVALID_FIELD_VALUE, 400, false);
        };

        await ingestService.ingestBatch(site_id, batch_id, measurements);
        return res.status(204).send();
    } catch (err) {
        next(err);
    };
};

module.exports = {
    ingest
};