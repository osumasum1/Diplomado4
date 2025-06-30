import { Users } from '../models/users.model.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { Tasks } from '../models/tasks.model.js';
import Op from '../database/op.js';

async function getUsers(req, res,next) {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE, // Filter to only include active users
            },
        });
        res.json(users);
    } catch (error) {
        logger.error('Error retrieving users:', error);
        next(error); // Pass the error to the error handler
    }
}

async function createUser(req, res,next) {
    try {
        const { username, password } = req.body;
        const newUser = await Users.create({
            username,
            password
        });
        res.status(201).json(newUser);
    } catch (error) {
        logger.error('Error creating user:', error);
        next(error); // Pass the error to the error handler
    }
}

async function getUserById(req, res,next) {
    const { id } = req.params;
    try {
        const user = await Users.findOne({
            attributes:['username','password','status'],
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        logger.error('Error retrieving user:', error);
        next(error); // Pass the error to the error handler
    }
}

async function updateUserById(req, res, next) {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await Users.update(
            { username, password },
            {
                where: { id: id },
                returning: true,
                individualHooks: true 
            }
        );
        res.json(user[1][0]); // user[1] contains the updated user object
    } catch (error) {
        logger.error('Error updating user:', error);
        next(error); // Pass the error to the error handler
    }
}

async function deleteUserById(req, res, next) {
    const { id } = req.params;

    try {
        const deleted = await Users.destroy({
            where: { id: id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        logger.error('Error deleting user:', error);
        next(error); // Pass the error to the error handler
    }
}

async function activateInactivateById(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if( !status || (status !== Status.ACTIVE && status !== Status.INACTIVE)) {
            return res.status(400).json({ message: `Invalid status. Use ${Status.ACTIVE} or ${Status.INACTIVE}.` });
        }

        const user = await Users.findOne({
            where: { id: id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json(user);
    } catch (error) {
        logger.error('Error updating user status:', error);
        next(error);
    }
}

async function getUserTasks(req, res, next) {
    const { id } = req.params;
    try {
        const user = await Users.findOne({
            attributes: ['username'],
            where: { id: id },
            include: [{
                model: Tasks,
                as: 'tasks', // Alias for the association
                attributes: ['name', 'done'], // Specify the attributes you want to retrieve
                where: {
                    done: false // Filter to only include tasks that are not done
                }
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Error retrieving user tasks:', error);
        next(error);
    }
}

async function getUsersSearch(req, res, next) {
    const { page, limit, search, orderBy, orderDir } = req.query;

    try {
        // Validar el límite permitido
        const allowedLimits = [5, 10, 15, 20];
        let pageLimit;
        if (limit === undefined) {
            pageLimit = 10;
        } else if (!allowedLimits.includes(Number(limit))) {
            return res.status(400).json({
                message: 'El parámetro limit solo puede ser 5, 10, 15 o 20.'
            });
        } else {
            pageLimit = Number(limit);
        }

        const searchClause = {
            ...(search && {
                username: {
                    [Op.like]: `%${search}%` // Search by username
                }
            })
        };

        const users = await Users.findAll({
            limit: pageLimit,
            offset: page ? (parseInt(page) - 1) * pageLimit : 0,
            order: [[orderBy || 'id', orderDir || 'DESC']],
            attributes: ['id', 'username', 'status'],
            where: {...searchClause},
        });
        const total = await Users.count({where: {...searchClause}});
        res.json({
            total: total,
            page: page ? parseInt(page) : 1,
            pages: Math.ceil(total / pageLimit),
            users
        });
    } catch (error) {
        logger.error('Error searching users:', error);
        next(error);
    }
}

export default {
    getUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    activateInactivateById,
    getUserTasks,
    getUsersSearch
};