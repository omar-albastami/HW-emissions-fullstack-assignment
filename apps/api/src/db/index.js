const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
    logger.error(null, `Unexpected PostgreSQL error: ${err.message}`);
    process.exit(1);
});

// Improvement for future: add logging, along with query duration
const query = async (queryText, parameters) => {
    return pool.query(queryText, parameters);
};

// For granular control over DB transactions
const getClient = async () => {
    return pool.connect();
};

const shutdown = async () => {
    return pool.end();
};

module.exports = {
    getClient,
    query,
    shutdown
};