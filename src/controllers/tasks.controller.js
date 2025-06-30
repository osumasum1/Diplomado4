import { Tasks } from '../models/tasks.model.js';

async function getTasks(req, res, next) {
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    try {
        const tasks = await Tasks.findAll({
            attributes: ['id', 'name','done'],
            order: [['name', 'DESC']],
            where: {
                userId: userId
            },
        });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    const { name } = req.body;

    try {
        const newTask = await Tasks.create({
            name,
            userId
        });
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
}

async function getTaskById(req, res, next) {
    const { id } = req.params;
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    try {
        const task = await Tasks.findOne({
            attributes: ['name', 'done'],
            where: {
                id,
                userId: userId
            }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTaskById(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    try {
        const task = await Tasks.update(
            { name },
            {
                where: {
                    id,
                    userId: userId
                }
            }
        );
        if (!task[0]) {
            return res.status(404).json({ message: 'Task not found or not updated' });
        }
    } catch (error) {
        next(error);
    }
}

async function taskDoneById(req, res, next) {
    const { id } = req.params;
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    const { done } = req.body;
    try {
        const task = await Tasks.update(
            { done },
            {
                where: {
                    id,
                    userId: userId
                }
            }
        );
        if (!task[0]) {
            return res.status(404).json({ message: 'Task not found or not updated' });
        }
    } catch (error) {
        next(error);
    }
}

async function deleteTaskById(req, res, next) {
    const { id } = req.params;
    const {userId} = req.user; // Assuming userId is available in req.user after authentication
    try {
        const task = await Tasks.destroy({
            where: {
                id,
                userId: userId
            }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not deleted' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export default {
    getTasks,
    createTask,
    getTaskById,
    updateTaskById,
    taskDoneById,
    deleteTaskById
};