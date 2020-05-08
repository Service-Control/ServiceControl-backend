
exports.up = function (knex) {
  return knex.schema.createTable('adresses', function (table) {
    table.increments();

    table.string('address').notNullable();
    table.string('uf').notNullable();
    table.string('county').notNullable();
    table.string('Neighborhood').notNullable();
    table.decimal('cep').notNullable();

    table.integer('type').notNullable();

    table.integer('userId');
    table.integer('companyId');
    
    table.foreign('userId').references('id').inTable('users');
    table.foreign('companyId').references('id').inTable('companies');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('adresses');
};
