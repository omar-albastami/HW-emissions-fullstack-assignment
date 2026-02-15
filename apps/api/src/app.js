const express = require('express');
const cors = require('cors');
const codes = require('./constants/codes');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');

const identityMiddleware = require('./middlewares/identity.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const ingestRouter = require('./routes/ingest.routes');
const sitesRouter = require('./routes/sites.routes');

const app = express();
app.use(cors({
    origin: process.env.UI_URL
}));

// Middlewares
app.use(identityMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    logger.info(req, `${req.method} ${req.url}${req.body? `\n${JSON.stringify(req.body, null, 2)}` : ''}`);
    next();
});

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API routers
app.use('/sites', sitesRouter);
app.use('/ingest', ingestRouter);
app.use((req, res, next) => {
    return next(new AppError (req.id, `Route ${req.url} does not exist`, codes.ENDPOINT_NOT_FOUND, 404));
});

// Catch-all error middlware
app.use(errorMiddleware);

module.exports = app;