import type { Knex } from 'knex';
import dotenv from 'dotenv';

// Update with your config settings.
dotenv.config();
const database = process.env.DB_NAME || 'democredit';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql',
        connection: { database, user, password },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

    production: {
        client: 'mysql',
        connection: { host, port, database, user, password },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};

export default config;
