const db = require('../../db');
const ingestQueries = require('../../queries/ingest.queries');
const measurementQueries = require('../../queries/measurements.queries');
const sitesQueries = require('../../queries/sites.queries');

const createAllTables = async () => {
    await sitesQueries.createSitesTable();
    await ingestQueries.createIngestionBatchesTable();
    await measurementQueries.createMeasurementsTable();
};

const dropAllTables = async () => {
    await measurementQueries.dropMeasurementsTable();
    await ingestQueries.dropIngestionBatchesTable();
    await sitesQueries.dropSitesTable();
};

const shutdown = async () => {
    await db.shutdown();
};

module.exports = {
    createAllTables,
    dropAllTables,
    shutdown
};