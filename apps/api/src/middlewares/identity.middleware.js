const { randomUUID } = require('crypto');

// Middleware to add/propagate a request ID to every incoming request
module.exports = (req, res, next) => {
    req.id = req.headers['x-request-id'] || randomUUID();
    res.setHeader('x-request-id', req.id);
    next();
};