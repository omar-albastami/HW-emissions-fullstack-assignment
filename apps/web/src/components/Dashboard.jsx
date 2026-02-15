import React, { useState, useEffect } from 'react';
import { getAllSites, getSiteMetrics } from '../services/api';
import IngestionForm from './IngestionForm';
import SiteCard from './SiteCard';

const Dashboard = () => {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchSites = async () => {
        setLoading(true);
        setError(null);

        try {
            const sitesData = await getAllSites();
            setSites(sitesData.sites);
            setLastUpdate(new Date ());
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch sites');
            console.error('An error occurred while fetching sites', err);
        } finally {
            setLoading(false);
        };
    };

    const refreshSiteMetrics = async (siteId) => {
        try {
            const metrics = await getSiteMetrics(siteId);
            // Update the site in the list of sites
            setSites((prevSites) => prevSites.map(site => site.id === siteId ? { ...site, ...metrics } : site));
        } catch (err) {
            console.error(`Error refreshing metrics for site ${siteId}:`, err);
        };
    };

    useEffect(() => {
        fetchSites();
    }, []);

    return (
        <div className='container-fluid py-4'>
            <div className='row mb-4'>
                <div className='col'>
                    <h1 className='display-4'>
                        Emissions Monitoring Dashboard
                    </h1>
                    <p className='lead text-muted'>
                        Real-time monitoring of industrial site emissions
                    </p>
                </div>
                <div className='col-auto'>
                    <button 
                        className='btn btn-outline-primary'
                        onClick={fetchSites}
                        disabled={loading}
                    >
                        {loading? (
                            <>
                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true' />
                                Refreshing ...
                            </>
                        ) : (
                            <>
                                <i className='bi bi-arrow-clockwise'/>
                                Refresh Sites
                            </>
                        )}
                    </button>
                </div>
            </div>
            {error && (
                <div className='row mb-4'>
                    <div className='col'>
                        <div className='alert alert-danger d-flex justify-content-between align-items-center' role='alert'>
                            <div>
                                <strong>Error:</strong> {error}
                            </div>
                            <button 
                                className='btn btn-sm btn-outline-danger'
                                onClick={fetchSites}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="row mb-4">
                <div className="col-lg-8 offset-lg-2">
                    <IngestionForm 
                        sites={sites} 
                        onSuccess={() => fetchSites()}
                    />
                </div>
            </div>
            {lastUpdate && (
                <div className='row mb-3'>
                    <div className='col'>
                        <small className='text-muted'>
                            Last Updated: {lastUpdate.toLocaleString()}
                        </small>
                    </div>
                </div>
            )}
            <div className='row mb-4'>
                <div className='col'>
                    <h3>Active Sites: ({sites.length})</h3>
                </div>
            </div>
            {loading && sites.length === 0 ? (
                <div className='row'>
                    <div className='col text-center py-5'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                        <p className='mt-3 text-muted'>Loading sites...</p>
                    </div>
                </div>
            ) : sites.length === 0 ? (
                <div className='row'>
                    <div className='col'>
                        <div className='alert alert-info' role='alert'>
                            <h4 className='alert-heading'>No sites found</h4>
                            <p>There are currently no sites in the system!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='row'>
                    {sites.map((site) => (
                        <SiteCard 
                            key={site.id} 
                            site={site} 
                            onRefresh={refreshSiteMetrics}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;