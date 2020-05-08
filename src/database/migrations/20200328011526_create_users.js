exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments().primary();

    table.string('name').notNullable();
    table.string('email').notNullable().unique();

    table.bigInteger('cpfCnpj').notNullable().unique();
    table.integer('typePerson').notNullable();

    table.integer('type').notNullable();
    table.integer('status').notNullable().defaultTo(0);

    table.string('password').notNullable();
    table.string('passwordResetToken');
    table.string('passwordResetExpires');

    table.timestamp('createdAt').defaultTo(knex.fn.now());;
    table.timestamp('updatedAt')
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
