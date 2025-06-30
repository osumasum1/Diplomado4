const requiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
}

const config = {
    PORT: requiredEnv('PORT') ?? 3000,
    DB_HOST: requiredEnv('DB_HOST'),
    DB_DATABASE: requiredEnv('DB_DATABASE'),
    DB_USER: requiredEnv('DB_USER'),
    DB_PASSWORD: requiredEnv('DB_PASSWORD'),
    DB_DIALECT: requiredEnv('DB_DIALECT'),
    BCRYPT_SALT_ROUNDS: +requiredEnv('BCRYPT_SALT_ROUNDS'),
    JWT_SECRET: requiredEnv('JWT_SECRET'),
    JWT_EXPIRATION_SECONDS: requiredEnv('JWT_EXPIRATION_SECONDS')
}

export default config