const app = require('../../app');
const codes = require('../../constants/codes');
const { randomUUID } = require('crypto');
const request = require('supertest');
const testUtils = require('../utils');

const measurementQueries = require('../../queries/measurements.queries');
const sitesQueries = require('../../queries/sites.queries');

beforeAll(async () => {
    await testUtils.dropAllTables();
    await testUtils.createAllTables();
});

afterAll(async () => {
    await testUtils.dropAllTables();
    await testUtils.shutdown();
});

describe('Test ingest API', () => {
    it('POST /ingest ingests a batch and updates site total', async () => {
        const site = await sitesQueries.createSite('Test site', 10, { region: 'ON' });
        await request(app)
            .post('/ingest')
            .send({
                batch_id: randomUUID(),
                site_id: site.id,
                measurements: [
                    { measured_at: '2026-02-14T00:00:00Z', methane_kg: 6 },
                    { measured_at: '2026-02-14T01:00:00Z', methane_kg: 5 }
                ]
            })
            .expect(204);

        const updatedSite = await sitesQueries.getSite(site.id);
        expect(updatedSite.total_emissions_to_date).toBe('11');
    });

    it('POST /ingest does not double count measurements upon retry', async () => {
        const site = await sitesQueries.createSite('Test site 20', 10, { region: 'ON' });
        const payload = {
            batch_id: randomUUID(),
            site_id: site.id,
            measurements: [
                { measured_at: '2026-02-14T00:00:00Z', methane_kg: 6 }
            ]
        };

        await request(app).post('/ingest').send(payload).expect(204);
        await request(app).post('/ingest').send(payload).expect(204);

        const updatedSite = await sitesQueries.getSite(site.id);
        expect(updatedSite.total_emissions_to_date).toBe('6');

        const siteMeasurements = await measurementQueries.getSiteMeasurements(site.id);
        expect(siteMeasurements.length).toBe(1);
    });

    it('POST /ingest returns a 400 error without measurements', async () => {
        const payload = {
            batch_id: randomUUID(),
            site_id: randomUUID(),
            measurements: []
        };

        const res = await request(app).post('/ingest').send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.body.code).toBe(codes.INVALID_FIELD_VALUE);
    });
});