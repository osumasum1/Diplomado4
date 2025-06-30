import 'dotenv/config';
import app from './app.js';
import logger from './logs/logger.js';
import config from './config/env.js';
import { sequelize } from './database/database.js';

async function main() {
    await sequelize.sync({ force: false })
    app.listen(config.PORT);
    logger.info('servidor esta corriendo en http://localhost:'+config.PORT);
}

main();