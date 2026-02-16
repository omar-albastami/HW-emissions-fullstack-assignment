import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

export const getAllSites = async () => {
    const res = await api.get('/sites');
    return res.data;
};

export const createSite = async (siteData) => {
    const res = await api.post('/sites', siteData);
    return res.data;
};

export const getSiteMetrics = async (siteId) => {
    const res = await api.get(`/sites/${siteId}/metrics`);
    return res.data;
};

export const ingestMeasurements = async (siteId, batchId, measurements) => {
    // batch_id is important to prevent duplicate submissions
    const res = await api.post('/ingest', {
        site_id: siteId,
        batch_id: batchId,
        measurements: measurements
    });
    return res.data;
};