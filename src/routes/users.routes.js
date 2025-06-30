import {Router} from 'express';
import userContoller from '../controllers/users.controller.js';
import validate from '../validators/validate.js';
import { createUserSchema } from '../validators/user.validate.js';
import { authenticateToken } from '../middlewares/authenticate.js';

const router = Router();
router.route('/')
  .get(userContoller.getUsers)
  .post(validate(createUserSchema,'body'),userContoller.createUser);
  
router.route('/list/pagination')
  .get(userContoller.getUsersSearch)

router.route('/:id')
  .get(authenticateToken, userContoller.getUserById)
  .put(authenticateToken, userContoller.updateUserById)
  .delete(authenticateToken, userContoller.deleteUserById)
  .patch(authenticateToken, userContoller.activateInactivateById);

router.get('/:id/tasks', authenticateToken, userContoller.getUserTasks);

export default router;