const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');


module.exports = function() {
  describe('POST todos/', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
    });

    it('creates a new todo in the database', async function() {
      const todo = await TodosModel.createTodo('todo 1');
      const allTodosFromDb = await TodosModel.getAllTodos(); 

      assert(allTodosFromDb.length === 1);
    });

    it('returns newly created todo in response body', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post('/todos')
        .send({ text: newTodoText });

      assert(response.body.hasOwnProperty('id'));
      assert(response.body.hasOwnProperty('status'));
      assert(response.body.hasOwnProperty('text'));
      assert(response.body.text === newTodoText);
    });

    it('newly created todos have INCOMPLETE status', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post('/todos')
        .send({ text: newTodoText });

      assert(response.body.status === 'INCOMPLETE');
    });
  });
};
