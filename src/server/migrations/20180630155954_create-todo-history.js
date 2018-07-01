
exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTable('todo_history', table => {
      table.increments();
      table.json('action');
      table.timestamp('date').defaultTo(knex.fn.now());
      table.integer('todo_id');
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('todo_history'); 
};
