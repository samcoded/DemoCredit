import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });

    //Wallet with amount and user_id
    await knex.schema.createTable("wallets", (table) => {
        table.increments("id").primary();
        table.integer("amount").notNullable();
        table.integer("user_id").notNullable().unsigned();
        // reference to user table for user_id
        table.foreign("user_id").references("users.id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });

    //Transaction with amount, type, wallet_id and user_id
    await knex.schema.createTable("transactions", (table) => {
        table.increments("id").primary();
        table.integer("amount").notNullable();
        table.string("type").notNullable();
        table.integer("wallet_id").notNullable().unsigned();
        table.integer("user_id").notNullable().unsigned();
        // reference to wallet table for wallet_id
        table.foreign("wallet_id").references("wallets.id");
        // reference to user table for user_id
        table.foreign("user_id").references("users.id");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("wallets");
}

