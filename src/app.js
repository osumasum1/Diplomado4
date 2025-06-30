import express from 'express';
import usersRoutes from './routes/users.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticateToken } from './middlewares/authenticate.js';


const app = express();

app.use(express.json());

app.use('/api/login', authRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/tasks', authenticateToken, tasksRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;