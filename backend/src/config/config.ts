import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, JWT_SECRET_KEY, PORT, SQL_DATABASE_URL, MONGO_DATABASE_URL, CORS_ORIGINS } = process.env;

assert(NODE_ENV, 'NODE_ENV is required');
assert(JWT_SECRET_KEY, 'JWT_SECRET_KEY is required');
assert(PORT, 'PORT is required');
assert(SQL_DATABASE_URL, 'SQL_DATABASE_URL is required');
assert(MONGO_DATABASE_URL, 'MONGO_DATABASE_URL is required');
assert(CORS_ORIGINS, 'CORS_ORIGINS is required');
// assert(TIMEZONE, 'TIMEZONE is required');


const corsOrigins = NODE_ENV?.toLowerCase() === 'local' ? '*' : CORS_ORIGINS?.split(',').map(origin => origin.trim()) ?? '*';

export default {
    SERVER: {
        NODE_ENV,
        JWT_SECRET_KEY,
        PORT,
        SQL_DATABASE_URL,
        MONGO_DATABASE_URL,
        CORS_ORIGINS: corsOrigins,
    }
};