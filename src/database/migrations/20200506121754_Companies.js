exports.up = function (knex) {
  return knex.schema.createTable('companies', function (table) {
    table.increments().primary();

    table.string('name').notNullable();
    table.string('tradingName').notNullable();
    table.string('email').notNullable();

    table.bigInteger('cpfCnpj').notNullable().unique();
    table.integer('typeCompany').notNullable();

    table.integer('status').notNullable().defaultTo(0);

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('companies');
};