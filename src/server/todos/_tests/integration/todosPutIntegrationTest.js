const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');
const TodoHistoryModel = require('../../TodoHistoryModel');
const { baseTodoRoute } = require('../../../constants/RouteConstants');


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
        .put(`${baseTodoRoute}/${todo.id}`)
        .send({
          todo: {
            status: updatedTodoStatus,
            text: updatedTodoText,
          }
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
        .put(`${baseTodoRoute}/${todo.id}`)
        .send({ 
          todo: {
            status: updatedTodoStatus,
            text: updatedTodoText,
          }
        });

      assert(response.body.todo.hasOwnProperty('id'));
      assert(response.body.todo.hasOwnProperty('status'));
      assert(response.body.todo.hasOwnProperty('text'));
    });

    it('returns a 404 status if the todo does not exist', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`${baseTodoRoute}/${todo.id + 1}`)
        .send({
          todo: {
            status: 'COMPLETE',
            text: 'new text',
          }
        });

      assert(response.status === 404);
    });

    it('creates an edit history event', async function() {
      const todo = await TodosModel.createTodo('todo 1');

      const response = await request(app)
        .put(`${baseTodoRoute}/${todo.id}`)
        .send({
          todo: {
            status: 'COMPLETE',
            text: 'new text',
          }
        });

      const allTodoEvents = await TodoHistoryModel.getAllTodoHistoryEvents();

      assert(allTodoEvents.length === 1);
      assert(allTodoEvents[0].todo_id === todo.id);
      assert(allTodoEvents[0].action.type === 'EDIT');
    });
  });
};
