
exports.up = function(knex, Promise) {
  return knex
    .schema
    .createTable('todo_history', table => {
      table.increments();
      table.string('action');
      table.timestamp('date');
      table.integer('todo_id');
    });

};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('todo_history'); 
};
