const app = require('../../app');
const codes = require('../../constants/codes');
const db = require('../../db');
const request = require('supertest');
const sitesQueries = require('../../queries/sites.queries');

beforeAll(async () => {
    await sitesQueries.dropSitesTable();
    await sitesQueries.createSitesTable();
});

afterAll(async () => {
    await sitesQueries.dropSitesTable();
    await db.shutdown();
});

describe('Test sites API', () => {
    it('POST /sites creates a site', async () => {
        const res = await request(app)
            .post('/sites')
            .send({
                name: 'API Test Site',
                emission_limit: 500,
                metadata: { region: 'BC' },
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe('API Test Site');
        expect(res.body.emission_limit).toBe('500');
    });

    it('POST /sites using a duplicate site name fails to create the duplicate site', async () => {
        let res;
        
        for (let i = 0; i < 2; i++) {
            res = await request(app)
                .post('/sites')
                .send({
                    name: 'Duplicate Test Site',
                    emission_limit: 500,
                    metadata: { region: 'BC' },
                });
        };

        expect(res.statusCode).toBe(409);
        expect(res.body.code).toBe(codes.DUPLICATE_RESOURCE);
    });
});