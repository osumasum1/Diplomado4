import logger from "../logs/logger.js";
import { Users } from "../models/users.model.js";
import { compare } from "../common/bcrypt.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id}, config.JWT_SECRET, {
            expiresIn: eval(config.JWT_EXPIRATION_SECONDS)
        });

        res.json({ token });

    } catch (error) {
        logger.error('Error logging in:', error);
        next(error);
    }
}

export default {
    login
}
