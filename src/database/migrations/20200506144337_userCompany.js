exports.up = function (knex) {
  return knex.schema.createTable('userCompany', function (table) {
    table.increments().primary();

    table.integer('type').notNullable();
    table.integer('status').notNullable().defaultTo(0);

    table.integer('userId');
    table.integer('companyId');

    table.foreign('userId').references('id').inTable('users');
    table.foreign('companyId').references('id').inTable('companies');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('userCompany');
};
