const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API routes
// Catch-all error handler

module.exports = app;