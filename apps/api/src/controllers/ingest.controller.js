const ingestService = require('../services/ingest.service');

const ingest = async (req, res, next) => {
    try {
        const { batch_id, site_id, measurements } = req.body;
        await ingestService.ingestBatch(site_id, batch_id, measurements);
        return res.status(204).send();
    } catch (err) {
        next(err);
    };
};

module.exports = {
    ingest
};