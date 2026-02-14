const db = require('../../db');
const sitesQueries = require('../../queries/sites.queries');

beforeAll(async () => {
    await sitesQueries.dropSitesTable();
    await sitesQueries.createSitesTable();
});

afterAll(async () => {
    await sitesQueries.dropSitesTable();
    await db.shutdown();
});

describe('Test sites queries', () => {
    it('creates a site', async () => {
        const site = await sitesQueries.createSite('Test Site', 1000, { region: 'AB' });

        expect(site.id).toBeDefined();
        expect(site.name).toBe('Test Site');
        expect(site.emission_limit).toBe('1000');
    });
});