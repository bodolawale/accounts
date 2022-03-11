import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', function (table) {
      table.bigIncrements('id').unsigned().primary();
      table.string('email', 45).notNullable();
      table.string('password', 255).notNullable();
      table.string('first_name', 255).notNullable();
      table.string('last_name', 255).notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    })
    .createTable('accounts', function (table) {
      table.bigIncrements('id').unsigned().primary();
      table.string('account_name', 45).notNullable();
      table.string('account_number', 255).notNullable();
      table.double('balance', 10, 2).notNullable();
      table.string('account_type', 255).notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      table.integer('user_id').unique().references('users.id').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accounts');
  await knex.schema.dropTable('users');
}
