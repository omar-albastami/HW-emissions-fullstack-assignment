const db = require('../db');
const tables = require('../constants/tables');

const createSitesTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS ${tables.SITES} (
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
        INSERT INTO ${tables.SITES} (name, emission_limit, metadata)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [name, emission_limit, metadata]
    );

    return res.rows[0];
};

const getSite = async (id) => {
    const res = await db.query(`SELECT * FROM ${tables.SITES} WHERE id = $1`, [id]);
    return res.rows[0];
};

const getAllSites = async () => {
    const res = await db.query(`SELECT * FROM ${tables.SITES}`);
    return res.rows;
};

const getSiteMetrics = async (id) => {
    const res = await db.query(`
        SELECT
            id AS site_id,
            emission_limit,
            total_emissions_to_date,
            created_at
        FROM ${tables.SITES}
        WHERE id = $1
    `,
    [id]);
    return res.rows[0];
};

const dropSitesTable = async () => {
    await db.query(`DROP TABLE IF EXISTS ${tables.SITES}`);
};

module.exports = {
    createSitesTable,
    createSite,
    dropSitesTable,
    getAllSites,
    getSite,
    getSiteMetrics
};