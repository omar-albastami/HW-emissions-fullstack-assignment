const identityMiddleware = require('./middlewares/identity.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const ingestRouter = require('./routes/ingest.routes');
const sitesRouter = require('./routes/sites.routes');

const express = require('express');
const AppError = require('./utils/AppError');

const app = express();

// Middlewares
app.use(identityMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API routers
app.use('/sites', sitesRouter);
app.use('/ingest', ingestRouter);
app.use((req, res, next) => {
    return next(new AppError (req.id, `Route ${req.url} does not exist`, 'NOT_FOUND', 404, false));
});

// Catch-all error middlware
app.use(errorMiddleware);

module.exports = app;