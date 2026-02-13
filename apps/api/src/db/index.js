const { Pool } = require('pg');

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL error', err);
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