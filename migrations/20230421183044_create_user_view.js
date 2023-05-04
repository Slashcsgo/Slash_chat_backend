/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createView('user', function (view) {
    view.columns(['id', 'name', 'description', 'email', 'password', 'created_at', 'updated_at', 'token'])
    view.as(knex('users').select('*'))
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropView('user')
};
