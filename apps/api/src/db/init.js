const { createSitesTable } = require('../queries/sites.queries');
const { createIngestionBatchesTable } = require('../queries/ingest.queries');
const { createMeasurementsTable } = require('../queries/measurements.queries');
const logger = require('../utils/logger');

// Create and prep all database resources required for proper app operation
const initializeDb = async () => {
    logger.info(null, 'Initializing database tables ...')
    await createSitesTable();
    await createIngestionBatchesTable();
    await createMeasurementsTable();
    logger.info(null, 'Database tables ready');
};

module.exports = initializeDb;