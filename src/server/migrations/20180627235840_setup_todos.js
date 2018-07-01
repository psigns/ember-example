
exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTable('todos', table => {
      table.increments();
      table.text('text');
      table.string('status');
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('todos'); 
};
