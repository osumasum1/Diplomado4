import {Router} from 'express';
import taskContoller from '../controllers/tasks.controller.js';

const router = Router();

router.route('/')
  .get(taskContoller.getTasks)
  .post(taskContoller.createTask);

router.route('/:id')
  .get(taskContoller.getTaskById)
  .put(taskContoller.updateTaskById)
  .patch(taskContoller.taskDoneById)
  .delete(taskContoller.deleteTaskById);

export default router;