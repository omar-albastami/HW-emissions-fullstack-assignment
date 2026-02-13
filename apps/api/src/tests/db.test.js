const db = require('../db');

// Local testing requires PostgreSQL container to be running!

afterAll(async () => {
    await db.shutdown();
});

describe('Test connection to PostgreSQL', () => {
    // Verifies reading .env and creation of pg.Pool
    it('can run a simple query', async () => {
        const res = await db.query('SELECT 1 + 1 AS SUM');
        expect(res.rows[0].sum).toBe(2);
    });
});