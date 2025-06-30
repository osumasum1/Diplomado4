import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../logs/logger.js';

export const encrypt = async (text) => {
    try {
        return await bcrypt.hash(text, config.BCRYPT_SALT_ROUNDS);
    } catch (error) {
        logger.error('Error encrypting text:', error);
        throw new Error('Encryption failed');
    }
}

export const compare = async (text, hash) => {
    try {
        return await bcrypt.compare(text, hash);
    } catch (error) {
        logger.error('Error comparing text with hash:', error);
        throw new Error("Comparison failed");
        
    }
}