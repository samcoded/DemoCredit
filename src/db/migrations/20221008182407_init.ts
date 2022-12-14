import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    //Wallet with amount and user_id
    await knex.schema.createTable('wallets', (table) => {
        table.increments('id').primary();
        table.integer('amount').notNullable();
        table.integer('user_id').notNullable().unsigned();
        // reference to user table for user_id
        table.foreign('user_id').references('users.id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    //Transaction with user_id, type, description, amount
    await knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable().unsigned();
        table.string('type').notNullable();
        table.string('description').notNullable();
        table.integer('amount').notNullable();
        // reference to user table for user_id
        table.foreign('user_id').references('users.id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions');
    await knex.schema.dropTable('wallets');
    await knex.schema.dropTable('users');
}
export const config = { transaction: false };
