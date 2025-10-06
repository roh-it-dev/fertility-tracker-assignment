exports.up = function (knex) {
  return knex.schema.hasColumn('tests', 'is_relevant').then(function (exists) {
    if (!exists) {
      return knex.schema.alterTable('tests', function (table) {
        table.boolean('is_relevant').notNullable().defaultTo(false);
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('tests', function (table) {
    table.dropColumn('is_relevant');
  });
};
