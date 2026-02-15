import React, { useState } from 'react';
import { ingestMeasurements } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const IngestionForm = (props) => {
    const { sites, onSuccess } = props;

    const [formData, setFormData] = useState({
        siteId: '',
        value: '',
        timestamp: new Date().toISOString().slice(0, 16)
    });
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [lastBatchId, setLastBatchId] = useState(null);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addMeasurement = () => {
        if (!formData.value || !formData.timestamp) {
            setError('Please fill in the value and timestamp');
            return;
        };

        const newMeasurement = {
            methane_kg: parseFloat(formData.value),
            measured_at: new Date (formData.timestamp).toISOString()
        };

        setMeasurements((prev) => [...prev, newMeasurement]);
    };

    const removeMeasurement = (idx) => {
        setMeasurements((prev) => prev.filter((_, i) => i !== idx));
    };

    const submitBatch = async (isRetry = false) => {
        if (!formData.siteId) {
            setError('Please select a site');
            return;
        };

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Re-use the same batch_id during retries
            const batchId = isRetry && lastBatchId? lastBatchId : uuidv4();

            if (!isRetry) {
                setLastBatchId(batchId);
            };

            await ingestMeasurements(formData.siteId, batchId, measurements);

            setSuccess(`Successfully ingested ${measurements.length} measurements`);
            // Reset state after success for the next batch
            setMeasurements([]);
            setLastBatchId(null);

            // Callback to parent to refresh data
            if (onSuccess) {
                onSuccess();
            };
        } catch (err) {
            console.log(err.message)
            console.log(err.response)
            setError(err.response?.data?.message || err.message || 'Failed to ingest measurements');
        } finally {
            setLoading(false);
        };
    };

    const retrySubmit = () => {
        submitBatch(true);
    };

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Manual Data Ingestion</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="siteId" className="form-label">Select Site</label>
                    <select
                        id="siteId"
                        name="siteId"
                        className="form-select"
                        value={formData.siteId}
                        onChange={handleFormChange}
                        disabled={loading}
                    >
                        <option value="">Choose a site...</option>
                        {sites.map(site => (
                            <option key={site.id} value={site.id}>
                                {site.name} (ID: {site.id})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="value" className="form-label">Methane Value (kg)</label>
                        <input
                            type="number"
                            id="value"
                            name="value"
                            className="form-control"
                            value={formData.value}
                            onChange={handleFormChange}
                            placeholder="e.g., 1.25"
                            step="0.01"
                            disabled={loading}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="timestamp" className="form-label">Timestamp</label>
                        <input
                            type="datetime-local"
                            id="timestamp"
                            name="timestamp"
                            className="form-control"
                            value={formData.timestamp}
                            onChange={handleFormChange}
                            disabled={loading}
                        />
                    </div>
                </div>
                <button 
                    className="btn btn-secondary mb-3" 
                    onClick={addMeasurement}
                    disabled={loading}
                >
                    Add to Batch
                </button>
                {measurements.length > 0 && (
                    <div className="mb-3">
                        <h6>Current Batch ({measurements.length} measurements)</h6>
                        <div className="list-group">
                            {measurements.map((measurement, index) => (
                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{measurement.methane_kg} kg</strong>
                                        <br />
                                        <small className="text-muted">
                                            {new Date(measurement.measured_at).toLocaleString()}
                                        </small>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeMeasurement(index)}
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    className="btn btn-primary w-100"
                    onClick={() => submitBatch(false)}
                    disabled={loading || measurements.length === 0}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                        </>
                    ) : (
                        `Submit Batch (${measurements.length} measurements)`
                    )}
                </button>
                {error && (
                    <div className="alert alert-danger mt-3 d-flex justify-content-between align-items-center" role="alert">
                        <div>
                            <strong>Error:</strong> {error}
                        </div>
                        {lastBatchId && (
                            <button
                                className="btn btn-sm btn-warning"
                                onClick={retrySubmit}
                                disabled={loading}
                            >
                                Retry
                            </button>
                        )}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success mt-3" role="alert">
                        {success}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngestionForm;