import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Tasks = sequelize.define('Tasks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Name is required',
            },
        },
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});