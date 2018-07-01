const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');


module.exports = function() {
  describe('DELETE todos/:id', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
    });

    it('deletes an existing record', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .delete(`/todos/${todo.id}`);

      const allTodos = await TodosModel.getAllTodos(); 

      assert(allTodos.length === 0);
    });
  });
};
