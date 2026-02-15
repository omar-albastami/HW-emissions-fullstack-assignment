const db = require('../db');
const tables = require('../constants/tables');

const ingestBatch = async (siteId, batchId, measurements) => {
    // Since we are attempting an atomic operation, create a transaction
    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');

        // Insert batch. If this is a batch that is already processed, no ID is returned
        const batchResult = await client.query(`
            INSERT INTO ${tables.INGESTION_BATCHES} (id, site_id)
            VALUES ($1, $2)
            ON CONFLICT (id) DO NOTHING
            RETURNING id
            `, 
            [batchId, siteId]
        );
        const isNewBatch = batchResult.rowCount === 1;

        // Insert measurements, and track added emissions onto site
        let emissionsInBatch = 0;
        const values = [];
        const placeholders = [];

        measurements.forEach((measurement, i) => {
            emissionsInBatch += Number(measurement.methane_kg);
            const idx = i * 4;
            placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
            values.push(siteId, batchId, measurement.measured_at, measurement.methane_kg);
        });

        await client.query(`
            INSERT INTO ${tables.MEASUREMENTS} (site_id, batch_id, measured_at, methane_kg)
            VALUES ${placeholders.join(',')}
            ON CONFLICT DO NOTHING
            `,
            values
        );

        // If the batch is new, lock the site and update total emissions
        if (isNewBatch) {
            // Lock target site
            await client.query(`
                SELECT id FROM ${tables.SITES} 
                WHERE id = $1 FOR UPDATE
                `,
                [siteId]
            );
            
            // Update the total emissions
            await client.query(`
                UPDATE ${tables.SITES}
                SET total_emissions_to_date = total_emissions_to_date + $1
                WHERE id = $2
                `,
                [emissionsInBatch, siteId]
            );
        };

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    };
};

module.exports = {
    ingestBatch
};