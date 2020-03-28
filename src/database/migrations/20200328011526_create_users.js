exports.up = function (knex) {
  return knex.schema.createTable('Users', function (table) {
    table.increments();

    table.string('name').notNullable();
    table.string('email').notNullable();
    table.decimal('cpfCnpj').notNullable();
    table.integer('type').notNullable();
    table.integer('typePerson').notNullable();
    table.string('password').notNullable();
    table.string('passwordResetToken');
    table.string('passwordResetExpires');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};