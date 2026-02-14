const AppError = require('../utils/AppError');
const codes = require('../constants/codes');
const logger = require('../utils/logger');

// Middleware to gracefully catch all errors and return appropriate response
module.exports = (err, req, res, next) => {
    logger.error(req, err.message);

    // For any non-AppError errors, the internal error should be logged but not exposed to the client
    let error = err;
    if (!error instanceof AppError) {
        error = new AppError (req.id, 'An internal error occurred' , codes.SERVER_ERROR, 500, true);
    };
  
    res.status(error.status).json(error.getErrorBody());
};