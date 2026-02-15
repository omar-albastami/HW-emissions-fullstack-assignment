const siteQueries = require('../queries/sites.queries');
const complianceStatuses = require('../constants/compliance_status');

const getSiteMetrics = async (siteId) => {
    const metrics = await siteQueries.getSiteMetrics(siteId);
    if (!metrics) {
        return null;
    };

    const remainingAllowance = Number(metrics.emission_limit) - Number(metrics.total_emissions_to_date);

    return {
        site_id: metrics.site_id,
        emission_limit: Number(metrics.emission_limit),
        total_emissions_to_date: Number(metrics.total_emissions_to_date),
        remaining_allowance: Math.max(remainingAllowance, 0),
        compliance_status: remainingAllowance >= 0? complianceStatuses.WITHIN_LIMIT : complianceStatuses.LIMIT_EXCEEDED,
        created_at: metrics.created_at
    };
};

module.exports = {
    getSiteMetrics
};