import {Sequelize} from 'sequelize';
import config from '../config/env.js';

export const sequelize = new Sequelize(
    config.DB_DATABASE, // Database name
    config.DB_USER, // Username
    config.DB_PASSWORD, // Password
    {
        host: config.DB_HOST, // Database host
        dialect: config.DB_DIALECT, // Database dialect (e.g., 'postgres', 'mysql', etc.)
        logging: console.log, // Log SQL queries to the console

        dialectOptions: 
            config.DB_USE_SSL === 'true'
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } :
            {}, // SSL options if needed
        }

);