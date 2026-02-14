// Utility for logging. Using console for simplicity, but this can be enhanced with log4js or other 3rd party monitoring libraries, depending on platform

const getUtcTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

const info = (req, message) => {
    const timestampBox = `[${getUtcTimestamp()}]`;
    const requestIdBox = req?.id? `[${req.id}]` : '';
    console.log(`${timestampBox}${requestIdBox}: ${message}`);
};

const error = (req, message) => {
    const timestampBox = `[${getUtcTimestamp()}]`;
    const requestIdBox = req?.id? `[${req.id}]` : '';
    console.error(`${timestampBox}${requestIdBox}: ${message}`);
};

module.exports = {
    info,
    error
};