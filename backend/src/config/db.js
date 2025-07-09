import { client } from 'pg';
import dotenv from 'dotenv';

const env = dotenv.config();
export const client = new client({
    host: env.parsed.DB_HOST,
    user: env.parsed.DB_USER,
    port: env.parsed.DB_PORT,
    password: env.parsed.DB_PASSWORD,
    database: env.parsed.DB_NAME,
});

