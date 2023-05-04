/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary()
      table.string('name')
      table.string('description')
      table.string('email')
      table.string('password')
      table.timestamps(true, true)
    })
    .createTable('chats', function (table) {
      table.increments('id').primary()
      table.string('title')
      table.string('description')
      table.timestamps(true, true)
    })
    .createTable('messages', function (table) {
      table.increments('id').primary()
      table.string('content')
      table.integer('user_id')
      table.foreign('user_id').references('id').inTable('users')
      table.integer('chat_id')
      table.foreign('chat_id').references('id').inTable('chats')
      table.timestamps(true, true)
    })
    .createTable('users_chats', function (table) {
      table.increments('id').primary()
      table.integer('user_id')
      table.foreign('user_id').references('id').inTable('users')
      table.integer('chat_id')
      table.foreign('chat_id').references('id').inTable('chats')
      table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTable('users_chats')
    .dropTable('messages')
    .dropTable('users')
    .dropTable('chats')
}
