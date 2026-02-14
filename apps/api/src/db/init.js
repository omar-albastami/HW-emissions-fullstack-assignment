const { createSitesTable } = require('../queries/sites.queries');
const logger = require('../utils/logger');

// Create and prep all database resources required for proper app operation
const initializeDb = async () => {
    logger.info(null, 'Initializing database tables ...')
    await createSitesTable();
    logger.info(null, 'Database tables ready');
};

module.exports = initializeDb;