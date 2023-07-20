/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("task", function (table) {
      table.increments("id");
      table.string("task", 255).notNullable();
      table
        .enum("status", ["unprogress", "progress", "finish"])
        .defaultTo("unprogress")
        .notNullable();
      table.date("eta").notNullable();
      table.date("extend_eta").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at").nullable();
    })
    .createTable("sub_task", function (table) {
      table.bigIncrements("id");
      table.bigInteger("task_id").unsigned().notNullable();
      table.string("task").notNullable();
      table
        .enum("status", ["unprogress", "progress", "finish"])
        .defaultTo("unprogress")
        .notNullable();
      table.date("eta").notNullable();
      table.date("extend_eta").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("task").dropTable("sub_task");
};
