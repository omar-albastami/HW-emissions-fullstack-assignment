const { z } = require('zod');

// Validate POST /sites body
const createSiteSchema = z.object({
    name: z.string()
        .min(1, 'Site name is required')
        .max(255, 'Site name must be less than 255 characters'),
    emission_limit: z.number().positive('Emission limit must be greater than 0'),
    metadata: z.object().optional().default({})
});

// Validate measurements in batch within /POST ingest
const measurementSchema = z.object({
    methane_kg: z.number().nonnegative('Methane value must be non-negative'),
    measured_at: z.iso.datetime('measured_at must be a valid ISO-8601 datetime')
});

// Validate /POST ingest body
const ingestBatchSchema = z.object({
    batch_id: z.uuid('batch_id must be a valid UUID'),
    site_id: z.uuid('site_id must be a valid UUID'),
    measurements: z.array(measurementSchema)
        .min(1, 'At least one measurement is required')
        .max(100, 'Cannot ingest more than 100 measurements at once')
});

// Validate UUID path parameters (e.g /sites/:id/metrics)
const uuidParamSchema = z.uuid('Invalid UUID format');

module.exports = {
    createSiteSchema,
    ingestBatchSchema,
    measurementSchema,
    uuidParamSchema
};