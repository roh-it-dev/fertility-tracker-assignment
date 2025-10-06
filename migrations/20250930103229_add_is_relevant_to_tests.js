exports.up = async function(knex) {
  await knex.schema.alterTable('tests', function(table) {
    table.boolean('is_relevant').defaultTo(false).notNullable(); 
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('tests', function(table) {
    table.dropColumn('is_relevant');
  });
};
