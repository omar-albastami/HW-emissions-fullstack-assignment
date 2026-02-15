const db = require('../db');
const tables = require('../constants/tables');

const createMeasurementsTable = async () => {
    // The UNIQUE constraint protects from duplicate measurements in batch retry cases
    await db.query(`
        CREATE TABLE IF NOT EXISTS ${tables.MEASUREMENTS} (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            site_id UUID NOT NULL REFERENCES ${tables.SITES}(id),
            batch_id UUID NOT NULL REFERENCES ${tables.INGESTION_BATCHES}(id),
            measured_at TIMESTAMPTZ NOT NULL,
            methane_kg NUMERIC NOT NULL CHECK (methane_kg >= 0),
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            UNIQUE (site_id, batch_id, measured_at)
        );
    `);
};

const getSiteMeasurements = async (siteId) => {
    const res = await db.query(`SELECT * FROM ${tables.MEASUREMENTS} WHERE site_id = $1`, [siteId]);
    return res.rows;
};

const dropMeasurementsTable = async () => {
    await db.query(`DROP TABLE IF EXISTS ${tables.MEASUREMENTS}`);
};

module.exports = {
    createMeasurementsTable,
    dropMeasurementsTable,
    getSiteMeasurements
};