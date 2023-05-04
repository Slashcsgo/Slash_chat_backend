/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .alterTable('chats', function(table) {
      table.integer('admin_id')
      table.foreign('admin_id').references('id').inTable('users')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .alterTable('chats', function(table) {
      table.dropForeign('admin_id')
      table.dropColumn('admin_id')
    })
};
