import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Status } from '../constants/index.js';
import { Tasks } from './tasks.model.js';
import {encrypt} from '../common/bcrypt.js';
import logger from '../logs/logger.js';

export const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Username must be unique' },
        validate: {
            notNull: {
                msg: 'Username is required',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required',
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Status must be either ${Status.ACTIVE} or ${Status.INACTIVE}`,
            },
        },
    },
});

Users.hasMany(Tasks, {
    foreignKey: 'userId',
    as: 'tasks', // Alias for the association
});
//Tasks.belongsTo(Users);

Users.beforeCreate(async (user) => {
    try { // Default to 10 if not set
        user.password = await encrypt(user.password);
    } catch (error) {
        logger.error('Error encrypt password:', error);
        throw new Error('Password encrypt failed');
        
    }
});

Users.beforeUpdate(async (user) => {
    try { // Default to 10 if not set
        user.password = await encrypt(user.password);
    } catch (error) {
        logger.error('Error encrypt password:', error);
        throw new Error('Password encrypt failed');
        
    }
});