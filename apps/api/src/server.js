require('dotenv').config();
const app = require('./app');
const initializeDb = require('./db/init');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const start = async () => {
    await initializeDb();
    app.listen(PORT, () => {
        logger.info(null, `API server listening on port ${PORT}`);
    });
};

start();