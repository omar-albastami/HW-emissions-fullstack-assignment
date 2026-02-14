const db = require('../db');

const SITES_TABLE_NAME = process.env.DATABASE_NAME? `${process.env.DATABASE_NAME}_sites` : 'sites';

const createSitesTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS ${SITES_TABLE_NAME} (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            emission_limit NUMERIC NOT NULL CHECK (emission_limit >= 0),
            total_emissions_to_date NUMERIC NOT NULL DEFAULT 0,
            metadata JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);
};

const createSite = async (name, emission_limit, metadata) => {
    const res = await db.query(`
        INSERT INTO ${SITES_TABLE_NAME} (name, emission_limit, metadata)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [name, emission_limit, metadata]
    );

    return res.rows[0];
};

const dropSitesTable = async () => {
    await db.query(`DROP TABLE IF EXISTS ${SITES_TABLE_NAME}`);
};

module.exports = {
    createSitesTable,
    createSite,
    dropSitesTable
};