const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');
const TodoHistoryModel = require('../../TodoHistoryModel');


module.exports = function() {
  describe('DELETE todos/:id', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });

    it('deletes an existing record', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .delete(`/api/todos/${todo.id}`);

      const allTodos = await TodosModel.getAllTodos(); 

      assert(allTodos.length === 0);
    });

    it('creates a delete todo history event', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .delete(`/api/todos/${todo.id}`);

      const allTodoEvents = await TodoHistoryModel.getAllTodoHistoryEvents();

      assert(allTodoEvents.length === 1);
      assert(allTodoEvents[0].todo_id === todo.id);
      assert(allTodoEvents[0].action.type === 'DELETE');
    });
  });
};
