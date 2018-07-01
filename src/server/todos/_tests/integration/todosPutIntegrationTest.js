const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');
const TodoHistoryModel = require('../../TodoHistoryModel');


module.exports = function() {
  describe('PUT todos/', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });

    it('updates an existing todo in the database', async function() {
      const updatedTodoText = 'this is an updated, complete todo';
      const updatedTodoStatus = 'COMPLETE';
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({
          id: todo.id,
          status: updatedTodoStatus,
          text: updatedTodoText,
        });

      const updatedTodo = await TodosModel.getTodoById(todo.id);

      assert(updatedTodo.status = updatedTodoStatus);
      assert(updatedTodo.text = updatedTodoText);
    });

    it('returns the updated todo in response payload', async function() {
      const updatedTodoText = 'this is an updated, complete todo';
      const updatedTodoStatus = 'COMPLETE';
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({
          id: todo.id,
          status: updatedTodoStatus,
          text: updatedTodoText,
        });

      assert(response.body.hasOwnProperty('id'));
      assert(response.body.hasOwnProperty('status'));
      assert(response.body.hasOwnProperty('text'));
    });

    it('returns a 400 status if the payload todo id does not match id parameter', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({
          id: todo.id + 1,
          status: 'COMPLETE',
          text: 'new text',
        });

      assert(response.status === 400);
    });

    it('returns a 404 status if the todo does not exist', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`/todos/${todo.id + 1}`)
        .send({
          id: todo.id + 1,
          status: 'COMPLETE',
          text: 'new text',
        });

      assert(response.status === 404);
    });

    it('creates an edit history event', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({
          id: todo.id,
          status: 'COMPLETE',
          text: 'new text',
        });

      const allTodoEvents = await TodoHistoryModel.getAllTodoHistoryEvents();

      assert(allTodoEvents.length === 1);
      assert(allTodoEvents[0].todo_id === todo.id);
      assert(allTodoEvents[0].action.type === 'EDIT');
    });
  });
};
