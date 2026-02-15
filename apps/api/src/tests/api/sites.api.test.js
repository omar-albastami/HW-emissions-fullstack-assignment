const app = require('../../app');
const codes = require('../../constants/codes');
const complianceStatuses = require('../../constants/compliance_status');
const tables = require('../../constants/tables');
const db = require('../../db');
const { randomUUID } = require('crypto');
const request = require('supertest');
const sitesQueries = require('../../queries/sites.queries');
const testUtils = require('../utils');

beforeEach(async () => {
    await testUtils.dropAllTables();
    await testUtils.createAllTables();
});

afterAll(async () => {
    await testUtils.dropAllTables();
    await testUtils.shutdown();
});

const updateSiteTotalEmissions = async (siteId, newTotalEmissions) => {
    await db.query(`
        UPDATE ${tables.SITES}
        SET total_emissions_to_date = $1
        WHERE id = $2
        `,
        [newTotalEmissions, siteId]
    );
};

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

    it ('GET /sites retrieves all sites', async () => {
        for (let i = 0; i < 3; i++) {
            await sitesQueries.createSite(`get-sites-${i}`, 500, { region: 'MB' });
        };

        const res = await request(app).get('/sites');
        expect(res.statusCode).toBe(200);
        expect(res.body.sites_total).toBe(3);
        expect(res.body.sites).toHaveLength(3);
    });

    it('GET /sites/:id/metrics compliance status is WITHIN_LIMIT when emissions below limit', async () => {
        const site = await sitesQueries.createSite('metrics-test-0', 500, { region: 'MB' });
        await updateSiteTotalEmissions(site.id, 450);

        const res = await request(app).get(`/sites/${site.id}/metrics`);

        expect(res.statusCode).toBe(200);
        expect(res.body.compliance_status).toBe(complianceStatuses.WITHIN_LIMIT);
        expect(res.body.remaining_allowance).toBe(50);
    });

    it('GET /sites/:id/metrics compliance status is LIMIT_EXCEEDED when emissions greater than limit', async () => {
        const site = await sitesQueries.createSite('metrics-test-1', 500, { region: 'MB' });
        await updateSiteTotalEmissions(site.id, 600);

        const res = await request(app).get(`/sites/${site.id}/metrics`);

        expect(res.statusCode).toBe(200);
        expect(res.body.compliance_status).toBe(complianceStatuses.LIMIT_EXCEEDED);
        expect(res.body.remaining_allowance).toBe(0);
    });

    it('GET /sites/:id/metrics returns 404 for non-existent site', async () => {
        const res = await request(app).get(`/sites/${randomUUID()}/metrics`);
        expect(res.statusCode).toBe(404);
        expect(res.body.code).toBe(codes.SITE_NOT_FOUND);
    }); 
});