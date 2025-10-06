exports.up = function (knex) {
  return knex.schema.createTable("tests", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enu("status", ["pending", "completed","processing","error", "in_review"])
      .defaultTo("pending");
    table.enu("result", ["Low", "High", "Peak"]).nullable();
    table.float("e3g");
    table.float("pdg");
    table.float("fsh");
    table.timestamp("test_created_at").defaultTo(knex.fn.now());
    table.timestamp("test_completed_at");
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tests");
};
