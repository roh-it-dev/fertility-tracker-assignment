exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', table => {
    table.increments('token_id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique();
    table.string('token', 500).notNullable();
    table.boolean('is_valid').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expire_at').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};