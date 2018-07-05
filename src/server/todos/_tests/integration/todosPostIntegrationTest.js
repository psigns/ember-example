const { assert } = require('chai');
const request = require('supertest');
const { startServer, db } = require('../../../server.js');
const TodosModel = require('../../TodosModel');
const TodoHistoryModel = require('../../TodoHistoryModel');
const { baseTodoRoute } = require('../../../constants/RouteConstants');


module.exports = function() {
  describe('POST todos/', function() {
    let app;

    before(async function() {
      app = await startServer();
    });

    beforeEach(async function() {
      await TodosModel.deleteAllTodos();
      await TodoHistoryModel.deleteAllTodoHistoryEvents();
    });

    it('creates a new todo in the database', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post(baseTodoRoute)
        .send({ todo: { text: newTodoText }});
      const allTodosFromDb = await TodosModel.getAllTodos(); 

      assert(allTodosFromDb.length === 1);
      assert(allTodosFromDb[0].text === newTodoText);
      assert(allTodosFromDb[0].status === 'INCOMPLETE');
    });

    it('creates a new create event in the todo_history table', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post(baseTodoRoute)
        .send({ todo: { text: newTodoText }});

      const allTodoHistoryEvents = await TodoHistoryModel.getAllTodoHistoryEvents(); 

      assert(allTodoHistoryEvents.length === 1);
      assert(allTodoHistoryEvents[0].action.type === 'CREATE');
      assert(allTodoHistoryEvents[0].hasOwnProperty('date'));
      assert(allTodoHistoryEvents[0].date !== null);
      assert(allTodoHistoryEvents[0].todo_id === response.body.todo.id);
    });

    it('returns newly created todo in response body', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post(baseTodoRoute)
        .send({ todo: { text: newTodoText }});

      assert(response.body.todo.hasOwnProperty('id'));
      assert(response.body.todo.hasOwnProperty('status'));
      assert(response.body.todo.hasOwnProperty('text'));
      assert(response.body.todo.text === newTodoText);
    });

    it('newly created todos have INCOMPLETE status', async function() {
      const newTodoText = 'a new todo';
      const response = await request(app)
        .post(baseTodoRoute)
        .send({ todo: { text: newTodoText }});

      assert(response.body.todo.status === 'INCOMPLETE');
    });
  });
};
