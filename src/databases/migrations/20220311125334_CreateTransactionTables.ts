import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', function (table) {
    table.bigIncrements('id').unsigned().primary();
    table.double('amount', 10, 2).notNullable();
    table.integer('from').nullable();
    table.integer('to').nullable();
    table.string('details', 255).nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions');
}
