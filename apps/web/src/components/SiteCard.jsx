import React from 'react';

const SiteCard = (props) => {
    const { site, onRefresh } = props;

    const isCompliant = Number(site.total_emissions_to_date) <= Number(site.emission_limit);
    const percentageUsed = ((Number(site.total_emissions_to_date) / Number(site.emission_limit)) * 100).toFixed(1);

    const statusColor = isCompliant? 'success' : 'danger';
    const statusText = isCompliant? 'Within Limit' : 'Limit Exceeded';

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className={`card h-100 border-${statusColor}`}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{site.name}</h5>
                    <span className={`badge bg-${statusColor}`}>{statusText}</span>
                </div>
                <div className="card-body">
                    <p className="text-muted small">Site ID: {site.id}</p>
                    <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold">Total Methane Emissions:</span>
                            <span>{Number(site.total_emissions_to_date).toFixed(2)} kg</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold">Methane Emission Limit:</span>
                            <span>{Number(site.emission_limit).toFixed(2)} kg</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="progress" style={{ height: '20px' }}>
                            <div
                                className={`progress-bar bg-${statusColor}`}
                                role="progressbar"
                                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                aria-valuenow={percentageUsed}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {percentageUsed}%
                            </div>
                        </div>
                    </div>
                    {site.metadata && Object.keys(site.metadata).length > 0 && (
                        <div className="mt-3">
                            <h6 className="text-muted">Metadata:</h6>
                            <ul className="list-unstyled small">
                                {Object.entries(site.metadata).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}:</strong> {JSON.stringify(value)}
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <button 
                        className="btn btn-sm btn-outline-primary w-100" 
                        onClick={() => onRefresh(site.id)}
                    >
                        <i className="bi bi-arrow-clockwise"></i> Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SiteCard;