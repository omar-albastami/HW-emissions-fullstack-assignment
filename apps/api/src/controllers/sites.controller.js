const AppError = require('../utils/AppError');
const codes = require('../constants/codes');
const sitesQueries = require('../queries/sites.queries');
const sitesService = require('../services/sites.service');

const createSite = async (req, res, next) => {
    const { name, emission_limit, metadata } = req.body;
    try {
        const createdSite = await sitesQueries.createSite(name, emission_limit, metadata);

        const resultBody = {
            id: createdSite.id,
            emission_limit: createdSite.emission_limit,
            name: createdSite.name,
            metadata: createdSite.metadata,
            total_emissions_to_date: createdSite.total_emissions_to_date,
            created_at: createdSite.created_at
        };

        res.status(201).json(resultBody);
    } catch (err) {
        if (err.code === '23505') {
            // unique name constraint violation
            return next(new AppError (req.id, `Site '${name}' already exists`, codes.DUPLICATE_RESOURCE, 409));
        }
        next(err);
    };
};

const getSites = async (req, res, next) => {
    try {
        const sites = await sitesQueries.getAllSites();
        const resultBody = {
            sites_total: sites.length,
            sites: sites
        };
        res.json(resultBody);
    } catch (err) {
        next(err);
    }
};

const getSiteMetrics = async (req, res, next) => {
    try {
        const siteId = req.params.id;
        const metrics = await sitesService.getSiteMetrics(siteId);
        
        if (!metrics) {
            throw new AppError (req.id, `Site with ID '${siteId}' does not exist`, codes.SITE_NOT_FOUND, 404);
        };

        res.status(200).json(metrics);
    } catch (err) {
        next(err);
    };
};

module.exports = {
    createSite,
    getSites,
    getSiteMetrics
};