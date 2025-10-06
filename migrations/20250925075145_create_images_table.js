exports.up = function(knex) {
  return knex.schema.createTable('test_images', table => {
    table.increments('id').primary();
    table.integer('test_id').unsigned().references('id').inTable('tests').onDelete('CASCADE');
    table.text('file_path').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('test_images');
};
