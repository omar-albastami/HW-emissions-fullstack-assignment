module.exports = {
    INGESTION_BATCHES: process.env.DATABASE_NAME? `${process.env.DATABASE_NAME}_ingestion_batches` : 'ingestion_batches',
    MEASUREMENTS: process.env.DATABASE_NAME? `${process.env.DATABASE_NAME}_emission_measurements` : 'emission_measurements',
    SITES: process.env.DATABASE_NAME? `${process.env.DATABASE_NAME}_sites` : 'sites'
};