import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('email', 45).notNullable();
    table.string('password', 255).notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
  await knex.schema.createTable('accounts', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('account_name', 45).notNullable();
    table.string('account_number', 255).notNullable();
    table.string('balance', 255).notNullable();
    table.string('account_type', 255).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });

  // create foreign keys
  await knex.schema.table('users', table => {
    table.integer('account_id').notNullable();
    table.foreign('account_id').references('id').inTable('accounts');
  });
  await knex.schema.table('accounts', table => {
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accounts');
  await knex.schema.dropTable('users');
}
