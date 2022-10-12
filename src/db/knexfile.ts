import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

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
            directory: path.resolve(__dirname, 'migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds'),
        },
    },
    test: {
        client: 'sqlite3',
        connection: ':memory:',
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
    },
    // test: {
    //     client: 'mysql',
    //     connection: {
    //         host,
    //         port,
    //         database: `test_${database}`,
    //         user,
    //         password,
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         directory: path.resolve(__dirname, 'migrations'),
    //         tableName: 'knex_migrations',
    //     },
    //     seeds: {
    //         directory: path.resolve(__dirname, 'seeds'),
    //     },
    // },
    production: {
        client: 'pg',
        connection: { host, port, database, user, password },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: path.resolve(__dirname, 'migrations'),
            tableName: 'knex_migrations',
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds'),
        },
    },
};

export default config;
