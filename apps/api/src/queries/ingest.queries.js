const db = require('../db');
const tables = require('../constants/tables');

const createIngestionBatchesTable = async () => {
    // The ID should be supplied by client
    await db.query(`
        CREATE TABLE IF NOT EXISTS ${tables.INGESTION_BATCHES} (
            id UUID PRIMARY KEY,
            site_id UUID NOT NULL REFERENCES ${tables.SITES}(id),
            received_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);
};

const dropIngestionBatchesTable = async () => {
    await db.query(`DROP TABLE IF EXISTS ${tables.INGESTION_BATCHES}`);
};

module.exports = {
    createIngestionBatchesTable,
    dropIngestionBatchesTable
};