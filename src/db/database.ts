import knex from 'knex';
import knexfile from './knexfile';
import dotenv from 'dotenv';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];
const db = knex(config);

export default db;
