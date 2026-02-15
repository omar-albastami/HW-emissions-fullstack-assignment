const { ZodError } = require('zod');
const AppError = require('../utils/AppError');
const codes = require('../constants/codes');

// Validate incoming request properties (e.g body, params) against zod schema
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        try {
            // Handle nested properties (e.g params.id)
            const parts = property.split('.');
            let dataToValidate = req;
            for (const part of parts) {
                dataToValidate = dataToValidate[part];
            };
            
            // Parse and validate the data
            const validated = schema.parse(dataToValidate);
            
            // Replace the nested property with validated data
            if (parts.length === 1) {
                req[parts[0]] = validated;
            } else if (parts.length === 2) {
                req[parts[0]][parts[1]] = validated;
            };
            
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                // Extract the first error for simplicity
                const firstError = err.issues[0];
                const message = `${firstError.path.join('.')}: ${firstError.message}`;
                
                return next(new AppError(req.id, message, codes.INVALID_FIELD_VALUE, 400));
            };
            next(err);
        }
    };
};

module.exports = validate;